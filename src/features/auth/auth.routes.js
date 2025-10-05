// imported important Packages

// Core imports
import express from "express";

// Middlewares
import validateUser from "../../middlewares/validator.middleware.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
import upload from "../../middlewares/fileUpload.middleware.js";

// Controller
import AuthController from "./auth.controller.js";

// making instance of authController
const authController = new AuthController();

// creating router from express
const authRouter = express.Router();

/**
 * Route: POST /signup
 * Purpose: Register a new user
 * Middleware: validateUser → ensures body has required fields
 */

authRouter.post("/signup", upload.single("avatar"),validateUser,authController.SignUp);

/**
 * Route: POST /signin
 * Purpose: User login
 */
authRouter.post("/signin", authController.SignIn);

/**
 * Route: POST /logout
 * Purpose: Logout from current device (invalidate refresh token)
 * Middleware: jwtAuth → ensures request has a valid access token
 */
authRouter.post("/logout", jwtAuth, authController.Logout);

/**
 * Route: POST /logout-all-devices
 * Purpose: Logout from all devices (clear all refresh tokens)
 * Middleware: jwtAuth → ensures request has a valid access token
 */
authRouter.post("/logout-all-devices", jwtAuth, authController.LogoutAll);

/**
 * Route: POST /refresh-token
 * Purpose: Generate a new access token using a valid refresh token
 * Middleware: None → works even if access token is expired (relies on refresh token)
 */
authRouter.post("/refresh-token", authController.RefreshToken);

/**
 * Route: POST /otp/send
 * Purpose: Send OTP to user
 */
authRouter.post("/otp/send", authController.SendOTP);

/**
 * Route: POST /otp/verify
 * Purpose: Verify user OTP
 */
authRouter.post("/otp/verify", authController.VerifyOTP);

/**
 * Route: POST /otp/reset-password
 * Purpose: Reset password using OTP
 */
authRouter.post("/otp/reset-password", authController.ResetPasswordWithOTP);

export default authRouter;
