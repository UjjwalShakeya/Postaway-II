// importing important modules
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import AuthModel from "./auth.model.js";
import AuthRepository from "./auth.respository.js";
import ApplicationError from "../../../utils/ApplicationError.js";

// Utils
import { sendEmail } from "../../../services/email.service.js";

// jwt secret from from dot env
const jwtSecret = process.env.JWT_SECRET;

export default class AuthController {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  SignUp = async (req, res, next) => {
    try {
      const { name, email, password, gender } = req.body;

      // Double-check input
      if (!name || !email || !password || !gender) {
        throw new ApplicationError("All fields are required", 400);
      }

      const existingUser = await this.authRepository.findByEmail(email);

      if (existingUser) {
        throw new ApplicationError("User already exists with this email", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new AuthModel(name, email, hashedPassword, gender);

      const result = await this.authRepository.signUp(user);

      const { accessToken, refreshToken, expiresIn } = await this.generateTokens(result);

      await this.authRepository.addRefreshToken(result._id, refreshToken);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: result._id,
          name: result.name,
          gender: result.gender,
          email: result.email,
        },
        accessToken,
        refreshToken,
        expiresIn,
      });
    } catch (err) {
      next(err);
    }
  };

  SignIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // checking email and password if any of them is missing then throw error
      if (!email || !password) {
        throw new ApplicationError("Email and password are required", 400);
      }

      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        // Don’t reveal whether email exists
        throw new ApplicationError("user not found", 404);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ApplicationError("Invalid Credentials", 401);
      }

      const { accessToken, refreshToken, expiresIn } = await this.generateTokens(user);

      await this.authRepository.addRefreshToken(user._id, refreshToken);

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        expiresIn,
      });
    } catch (err) {
      next(err);
    }
  }

  SendOTP = async (req, res, next)=> {
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
  }

   VerifyOTP = async(req, res, next) => {
    try {
      const { email, otp } = req.body;

      const user = await this.authRepository.findByEmail(email);

      if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        throw new ApplicationError("Invalid or expired OTP", 400);
      }

      await this.authRepository.clearOTP(email);

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      next(err);
    }
  }

   ResetPasswordWithOTP = async(req, res, next)=> {
    try {
      const { email, newPassword } = req.body;

      if (!newPassword) {
        throw new ApplicationError("New password is required", 400);
      }

      const user = await this.authRepository.findByEmail(email);
      if (!user) throw new ApplicationError("User not found", 404);

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.authRepository.updatePassword(email, hashedPassword);

      return res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      next(err);
    }
  }

   sendOTPEmail = async(email, otp) =>{
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
  }

  generateTokens = async(user) => {
    const accessToken = jwt.sign(
      { userID: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userID: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken, expiresIn: "1h" };
  }

  // logout
   Logout = async(req, res, next)=> {
    try {
      const { refreshToken } = req.body;

      const user = await this.authRepository.findByRefreshToken(refreshToken);

      // user not found
      if (!user) {
        throw new ApplicationError("Invalid refresh token", 400);
      }

      await this.authRepository.removeRefreshToken(user._id, refreshToken);

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  }

  // logout all
   LogoutAll = async(req, res, next) => {
    try {
      const userId = req.userID;

      // user not found
      if (!userId) {
        throw new ApplicationError("User ID required", 400);
      }
      await this.authRepository.removeAllRefreshToken(userId);

      return res.status(200).json({ message: "Logged out from all devices" });
    } catch (err) {
      next(err);
    }
  }
}
