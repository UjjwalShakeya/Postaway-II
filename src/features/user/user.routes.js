import express from "express";
import jwtAuth from "../../middlewares/jwt.middleware.js";
import UserController from "../user/user.controller.js";
const userRouter = express.Router();

// instance of user controller
const userControllerInc = new UserController();

userRouter.get("/get-details/:userId", jwtAuth, userControllerInc.getUser);

userRouter.get("/get-all-details/", jwtAuth, userControllerInc.getAllUsers);

userRouter.put(
  "/update-details/:userId/",
  jwtAuth,
  userControllerInc.updateUserById
);

export default userRouter;
