// importing important modules
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

import AuthModel from "./auth.model.js";
import AuthRepository from "./auth.respository.js";
import ApplicationError from "../../../utils/ApplicationError.js";

// jwt secret from from dot env
const jwtSecret = process.env.JWT_SECRET;

export default class AuthController {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async SignUp(req, res, next) {
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

      // Optional: Auto-login after signup
      const token = jwt.sign(
        { userID: result._id, email: result.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          userID: result._id,
          email: result.email,
        },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      await this.authRepository.addRefreshToken(result._id, refreshToken);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: result._id,
          name: result.name,
          gender: result.gender,
          email: result.email,
        },
        token,
        refreshToken,
        expiresIn: "1h",
      });
    } catch (err) {
      next(err);
    }
  }

  async SignIn(req, res, next) {
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

      const token = jwt.sign(
        { userID: user._id, email: user.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          userID: user._id,
          email: user.email,
        },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      await this.authRepository.addRefreshToken(user._id, refreshToken);

      return res.status(200).json({
        message: "Login successful",
        token,
        refreshToken,
        expiresIn: "1h",
      });
    } catch (err) {
      next(err);
    }
  }

  async SendOTP(req, res, next) {
    try {
      const { email } = req.body;
      // checking first whether user is exist in the db or not
      const user = await this.authRepository.findByEmail(email);
      if (!user) throw new ApplicationError("User not found", 404);

      // generating OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins

      console.log("otp", otp);
      console.log("otpExpiry", otpExpiry);

      // set OTP to database
      await this.authRepository.setOTP(email, otp, otpExpiry);

      await this.sendOTPEmail(email, otp);

      return res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
      next(err);
    }
  }

  async VerifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      const user = this.authRepository.findByEmail(email);

      if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        throw new ApplicationError("Invalid or expired OTP", 400);
      }

      await this.authRepository.clearOTP(email);

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      next(err);
    }
  }

  async ResetPasswordWithOTP(req, res, next) {
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

  async sendOTPEmail(email, otp) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
      });
      return true;
    } catch (err) {
      console.error("Error sending OTP email:", err);
      throw new ApplicationError("Failed to send OTP email", 400);
    }
  }

  // async ForgetPassword(req, res, next) {
  //   try {
  //     const { email } = req.body;

  //     // checking first whether user is exist in the db or not
  //     const user = await this.authRepository.findByEmail(email);

  //     if (!user) {
  //       throw new ApplicationError("user not found", 400);
  //     }

  //     const resetToken = crypto.randomBytes(32).toString("hex");
  //     const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // expires in 15 min

  //     await this.authRepository.setResetToken(
  //       user.email,
  //       resetToken,
  //       resetTokenExpiry
  //     );

  //
  //     return res
  //       .status(200)
  //       .json({ message: "Password reset link sent to email" });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // Reset with token
  // async ResetPasswordWithToken(req, res, next) {
  //   try {
  //     const { token } = req.params;
  //     const { newPassword } = req.body;

  //     // validate inputs
  //     if (!newPassword) {
  //       throw new ApplicationError("New password is required", 400);
  //     }

  //     // find user by token
  //     const user = await this.authRepository.findByResetToken(token);
  //     console.log(user);
  //     if (!user) {
  //       throw new ApplicationError("Token is invalid or expired", 400);
  //     }

  //     // hash password
  //     const hashedPassword = await bcrypt.hash(newPassword, 12);

  //     await this.authRepository.updatePasswordWithToken(token, hashedPassword);

  //     return res.status(200).json({ message: "Password reset successful" });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // logout
  async Logout(req, res, next) {
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
  async LogoutAll(req, res, next) {
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
