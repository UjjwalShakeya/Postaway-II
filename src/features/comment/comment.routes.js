// imported important Packages
import express from "express";
// creating router from express
const commentRouter = express.Router();
import CommentController from "./comment.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// creating instance of controller
const CommentControllerInc = new CommentController();

// retrieving all the comments of specific post
commentRouter.get("/:postId", jwtAuth, (req, res, next) =>
  CommentControllerInc.getAllPostComments(req, res, next)
);

// add a new comment to a specific post
commentRouter.post("/:postId", jwtAuth, (req, res, next) =>
  CommentControllerInc.createComment(req, res, next)
);

// remove specific comment by id
commentRouter.delete("/:commentId", jwtAuth, (req, res, next) =>
  CommentControllerInc.deleteComment(req, res, next)
);

// // // update specific comment by id
// commentRouter.put("/:id", jwtAuth, (req, res, next) =>
//   CommentControllerInc.updateComment(req, res, next)
// );


export default commentRouter;
