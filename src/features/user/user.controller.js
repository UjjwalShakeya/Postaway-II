// importing important modules
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApplicationError from "../../../utils/ApplicationError.js";
const jwtSecret = process.env.JWT_SECRET;
import crypto from "crypto";
import nodemailer from "nodemailer";

import UserRepository from "./user.respository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async SignUp(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Double-check input
      if (!name || !email || !password) {
        throw new ApplicationError("All fields are required", 400);
      }

      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        throw new ApplicationError("User already exists with this email", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, hashedPassword);

      const result = await this.userRepository.signUp(user);

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

      await this.userRepository.addRefreshToken(result._id, refreshToken);

      return res.status(201).json({
        message: "User created successfully",
        user: { id: result._id, name: result.name, email: result.email },
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

      const user = await this.userRepository.findByEmail(email);

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

      await this.userRepository.addRefreshToken(user._id, refreshToken);

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

  async ForgetPassword(req, res, next) {
    try {
      const { email } = req.body;

      // checking first whether user is exist in the db or not
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new ApplicationError("user not found", 400);
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // expires in 15 min

      await this.userRepository.setResetToken(
        user.email,
        resetToken,
        resetTokenExpiry
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetLink = `http://localhost:3000/api/users/reset-password/${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset</p>
               <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>`,
      });
      return res
        .status(200)
        .json({ message: "Password reset link sent to email" });
    } catch (err) {
      next(err);
    }
  }

  // Reset with token
  async ResetPasswordWithToken(req, res, next) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // validate inputs
      if (!newPassword) {
        throw new ApplicationError("New password is required", 400);
      }

      // find user by token
      const user = await this.userRepository.findByResetToken(token);
      console.log(user);
      if (!user) {
        throw new ApplicationError("Token is invalid or expired", 400);
      }

      // hash password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await this.userRepository.updatePasswordWithToken(token, hashedPassword);

      return res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      next(err);
    }
  }

  // logout
  async Logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      const user = await this.userRepository.findByRefreshToken(refreshToken);

      // user not found
      if (!user) {
        throw new ApplicationError("Invalid refresh token", 400);
      }

      await this.userRepository.removeRefreshToken(user._id, refreshToken);

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
      await this.userRepository.removeAllRefreshToken(userId);

      return res.status(200).json({ message: "Logged out from all devices" });
    } catch (err) {
      next(err);
    }
  }
}
