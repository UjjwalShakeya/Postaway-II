// Like routes

// Import required packages :-

// Third-party packages
import express from "express";

// Application modules :-
import jwtAuth from "../../middlewares/jwt.middleware.js";
import LikeController from "./like.controller.js";

// Initialize router and controller :-
const LikeRouter = express.Router();
const likeController = new LikeController();

// Routes :-

// toggling a like to a Post
// Purpose: toggling a like/deslike
// Middleware: jwtAuth → ensures user is authenticated
LikeRouter.post("/toggle/:id", jwtAuth, likeController.toggleLike);

// Purpose: Retrieve all likes
// Middleware: jwtAuth → ensures user is authenticated
LikeRouter.get("/:id", jwtAuth, likeController.getAllLikes);

export default LikeRouter;
