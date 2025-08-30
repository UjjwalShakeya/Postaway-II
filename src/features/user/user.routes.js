import express from "express";
import jwtAuth from "../../middlewares/jwt.middleware.js";
import UserController from "../user/user.controller.js";
const userRouter = express.Router();

// instance of user controller
const userControllerInc = new UserController();


userRouter.get("/get-details/:userId", jwtAuth, (req, res, next) => {
  userControllerInc.getUser(req, res, next);
});


export default userRouter;