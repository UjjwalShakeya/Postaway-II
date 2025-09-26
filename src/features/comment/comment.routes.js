// Comment routes

// Import required packages :-

// Third-party packages
import express from "express";

// Application modules :-
import CommentController from "./comment.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// Initialize router and controller :-
const commentRouter = express.Router();
const commentController = new CommentController();

// Routes :-

// Purpose: retrieve all the comments of specific post
// Middleware: jwtAuth → ensures user is authenticated
commentRouter.get("/:postId", jwtAuth,commentController.getAllPostComments);

// Purpose: add a new comment to a specific post
// Middleware: jwtAuth → ensures user is authenticated
commentRouter.post("/:postId", jwtAuth,commentController.createComment);

// Purpose: remove specific comment by id
// Middleware: jwtAuth → ensures user is authenticated
commentRouter.delete("/:commentId", jwtAuth, commentController.deleteComment);

// Purpose: update specific comment by id
// Middleware: jwtAuth → ensures user is authenticated
commentRouter.put("/:commentId", jwtAuth, commentController.updateComment);


export default commentRouter;
