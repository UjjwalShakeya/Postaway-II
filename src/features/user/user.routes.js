// imported important Packages
import express from "express";
import validateUser from "../../middlewares/validator.middleware.js";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// making instance of userController
const userControllerInc = new UserController();

// creating router from express
const userRouter = express.Router();

// user router for signup
userRouter.post("/signup", validateUser, (req, res, next) =>
  userControllerInc.SignUp(req, res, next)
);

// user router for signin
userRouter.post("/signin", (req, res, next) =>
  userControllerInc.SignIn(req, res, next)
);

// user router for forget password
userRouter.post('/forget-password',(req, res, next)=>{
  userControllerInc.ForgetPassword(req, res, next);
})

// user router for reset password 
userRouter.post("/reset-password/:token", (req, res, next) =>{
  userControllerInc.ResetPasswordWithToken(req, res, next);
});
  
// user router for logout 
userRouter.post("/logout",jwtAuth, (req, res, next) =>{
  userControllerInc.Logout(req, res, next);
});

// user router for logout 
userRouter.post("/logout-all-devices",jwtAuth, (req, res, next) =>{
  userControllerInc.LogoutAll(req, res, next);
});

export default userRouter;
