// Import required packages :-
// Third-party packages
import express from "express";

// Application modules :-
import jwtAuth from "../../middlewares/jwt.middleware.js";
import UserController from "../user/user.controller.js";

// Initialize router and controller :-
const userRouter = express.Router();
const userControllerInc = new UserController();

// Routes :-
// Get user details by ID
// Purpose: Fetch a specific user's details
// Middleware: jwtAuth → ensures user is authenticated
userRouter.get("/get-details/:userId", jwtAuth, userControllerInc.getUser);

// Get all user details
// Purpose: Fetch details of all users
// Middleware: jwtAuth → ensures user is authenticated
userRouter.get("/get-all-details/", jwtAuth, userControllerInc.getAllUsers);

// Update user details
// Purpose: Update details of a specific user
// Middleware: jwtAuth → ensures user is authenticated
userRouter.put(
  "/update-details/:userId/",
  jwtAuth,
  userControllerInc.updateUserById
);

export default userRouter;
