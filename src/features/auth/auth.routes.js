// imported important Packages
import express from "express";
import validateUser from "../../middlewares/validator.middleware.js";
import AuthController from "./auth.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// making instance of authController
const authControllerInc = new AuthController();

// creating router from express
const authRouter = express.Router();

// auth router for signup
authRouter.post("/signup", validateUser, (req, res, next) =>
  authControllerInc.SignUp(req, res, next)
);

// auth router for signin
authRouter.post("/signin", (req, res, next) =>
  authControllerInc.SignIn(req, res, next)
);

// auth router for forget password
authRouter.post("/forget-password", (req, res, next) => {
  authControllerInc.ForgetPassword(req, res, next);
});

// auth router for reset password
authRouter.post("/reset-password/:token", (req, res, next) => {
  authControllerInc.ResetPasswordWithToken(req, res, next);
});

// auth router for logout
authRouter.post("/logout", jwtAuth, (req, res, next) => {
  authControllerInc.Logout(req, res, next);
});

// auth router for logout
authRouter.post("/logout-all-devices", jwtAuth, (req, res, next) => {
  authControllerInc.LogoutAll(req, res, next);
});

export default authRouter;
