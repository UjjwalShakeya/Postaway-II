// importing important modules
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

import AuthModel from "./auth.model.js";
import AuthRepository from "./auth.respository.js";
import ApplicationError from "../../../utils/ApplicationError.js";

// Utils
import { sendEmail } from "../../../services/email.service.js";
import { setAuthCookies, clearAuthCookies } from "../../../utils/cookies.js";

// jwt secret from from dot env
const jwtSecret = process.env.JWT_SECRET;

export const generateAccessToken = async (user) => {
  const accessToken = jwt.sign(
    { userID: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived
  );
  return { accessToken, expiresIn: 15 * 60 * 1000 };
};

export const generateRefreshToken = async (user, authRepository) => {
  const refreshToken = jwt.sign(
    { userID: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  await authRepository.addRefreshToken(user._id, refreshToken);
  return refreshToken;
};

export default class AuthController {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  // helper functions
  sendOTPEmail = async (email, otp) => {
    try {
      await sendEmail(
        email,
        otp,
        `Your OTP code is: ${otp}. It is valid for 10 minutes.`
      );
    } catch (err) {
      console.error("Error sending OTP email:", err);
      throw new ApplicationError("Failed to send OTP email", 400);
    }
  };

  SignUp = async (req, res, next) => {
    try {
      const { name, email, password, gender } = req.body;
      let allowedGenders = ["male", "female", "other"];

      // Double-check input
      if (!name || !email || !password || !gender) {
        throw new ApplicationError("All fields are required", 400);
      }

      if (!allowedGenders.includes(gender.toLowerCase())) {
        throw new ApplicationError("Please provide valid gender", 400);
      }

      if (!req.file) throw new ApplicationError("Avatar Image is required", 400);

      const existingUser = await this.authRepository.findByEmail(email.toLowerCase());

      if (existingUser) {
        throw new ApplicationError("User already exists with this email", 409);
      };

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new AuthModel(name, email.toLowerCase(), hashedPassword, gender.toLowerCase(), req.file.filename);

      const result = await this.authRepository.signUp(user);

      const { accessToken, expiresIn } = generateAccessToken(result);
      const refreshToken = generateRefreshToken(result, this.authRepository);
      // await this.authRepository.addRefreshToken(result._id, refreshToken);

      setAuthCookies(res, accessToken, expiresIn, refreshToken);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: result._id,
          name: result.name,
          gender: result.gender,
          email: result.email,
          avatar: result.avatar,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  SignIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // checking email and password if any of them is missing then throw error
      if (!email || !password)
        throw new ApplicationError("Email and password required", 400);

      const user = await this.authRepository.findByEmail(email.toLowerCase());

      if (!user) throw new ApplicationError("Invalid email or password", 401);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new ApplicationError("Invalid email or password", 401);

      const { accessToken, expiresIn } = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user, this.authRepository);

      setAuthCookies(res, accessToken, expiresIn, refreshToken);

      return res.status(200).json({
        success: true,
        message: "Login successful",
      });
    } catch (err) {
      next(err);
    }
  };
  // logout
  Logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) await this.authRepository.removeRefreshToken(req.userID, refreshToken);
      clearAuthCookies(res);

      res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (err) {
      next(err);
    }
  };

  // logout all
  LogoutAll = async (req, res, next) => {
    try {
      const userId = req.userID;
      if (!userId) throw new ApplicationError("User ID required", 400);
      await this.authRepository.removeAllRefreshToken(userId);
      await this.authRepository.incrementTokenVersion(userId);

      clearAuthCookies(res);

      res.status(200).json({ success: true, message: "Logged out from all devices" });
    } catch (err) {
      next(err);
    }
  };

  SendOTP = async (req, res, next) => {

    try {
      const { email } = req.body;

      // checking first whether user is exist in the db or not
      const user = await this.authRepository.findByEmail(email);
      if (!user) throw new ApplicationError("User not found", 404);

      // generating OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

      // set OTP to database
      await this.authRepository.setOTP(email, otp, otpExpiry);

      await this.sendOTPEmail(email, otp);

      return res.status(200).json({ message: "OTP sent to email" });

    } catch (err) {
      next(err);
    }
  };

  VerifyOTP = async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const user = await this.authRepository.findByEmail(email);

      if (!user || !user.otp || Date.now() > user.otpExpiry) {
        throw new ApplicationError("Invalid or expired OTP", 400);
      }

      if (user.otp !== otp) {
        throw new ApplicationError("Invalid  OTP", 400);
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins

      await this.authRepository.setResetToken(email, resetToken, resetTokenExpiry);
      await this.authRepository.clearOTP(email);

      return res.status(200).json({ message: "OTP verified successfully", resetToken });

    } catch (err) {
      next(err);
    }
  };

  ResetPasswordWithOTP = async (req, res, next) => {
    try {
      const { email, resetToken, newPassword } = req.body;

      if (!newPassword || !resetToken) {
        throw new ApplicationError("Reset token and new password are required", 400);
      }

      const user = await this.authRepository.findByEmail(email);
      if (!user) throw new ApplicationError("User not found", 404);

      if (!user.resetToken || user.resetToken !== resetToken || Date.now() > user.resetTokenExpiry) {
        throw new ApplicationError("Invalid or expired reset token", 400);
      };

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.authRepository.updatePassword(email, hashedPassword);

      res.clearCookie("accessToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
      res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });

      return res.status(200).json({ message: "Password reset successful. Please sign in again to continue." });


    } catch (err) {
      next(err);
    }
  };

  RefreshToken = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

      let payload;
      try { payload = jwt.verify(refreshToken, process.env.JWT_SECRET); }
      catch { return res.status(401).json({ error: "Invalid or expired refresh token" }); }

      const user = await this.authRepository.findById(payload.userID);
      if (!user || !user.refreshTokens.includes(refreshToken)) return res.status(401).json({ error: "Refresh token revoked" });

      const { accessToken, expiresIn } = generateAccessToken(user);

      setAuthCookies(res, accessToken, expiresIn); // no need to set refresh token again
      res.status(200).json({ success: true, message: "Access token refreshed" });
    } catch (err) {
      next(err);
    }
  };
}
