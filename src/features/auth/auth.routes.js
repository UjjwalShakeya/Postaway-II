// imported important Packages

// Core imports
import express from "express";

// Middlewares
import validateUser from "../../middlewares/validator.middleware.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// Controller
import AuthController from "./auth.controller.js";

// making instance of authController
const authControllerInc = new AuthController();

// creating router from express
const authRouter = express.Router();

/**
 * Route: POST /signup
 * Purpose: Register a new user
 * Middleware: validateUser → ensures body has required fields
 */

authRouter.post("/signup", validateUser, (req, res, next) =>
  authControllerInc.SignUp(req, res, next)
);

/**
 * Route: POST /signin
 * Purpose: User login
 */
authRouter.post("/signin", (req, res, next) =>
  authControllerInc.SignIn(req, res, next)
);

/**
 * Route: POST /otp/send
 * Purpose: Send OTP to user
 */

authRouter.post("/otp/send", (req, res, next) => {
  authControllerInc.SendOTP(req, res, next);
});

/**
 * Route: POST /otp/verify
 * Purpose: Verify user OTP
 */
authRouter.post("/otp/verify", (req, res, next) => {
  authControllerInc.VerifyOTP(req, res, next);
});

/**
 * Route: POST /otp/reset-password
 * Purpose: Reset password using OTP
 */
authRouter.post("/otp/reset-password", (req, res, next) => {
  authControllerInc.ResetPasswordWithOTP(req, res, next);
});


/**
 * Route: POST /logout
 * Purpose: Logout from current device (invalidate refresh token)
 * Middleware: jwtAuth → ensures request has a valid access token
 */
authRouter.post("/logout", jwtAuth, (req, res, next) => {
  authControllerInc.Logout(req, res, next);
});

/**
 * Route: POST /logout-all-devices
 * Purpose: Logout from all devices (clear all refresh tokens)
 * Middleware: jwtAuth → ensures request has a valid access token
 */
authRouter.post("/logout-all-devices", jwtAuth, (req, res, next) => {
  authControllerInc.LogoutAll(req, res, next);
});

export default authRouter;
