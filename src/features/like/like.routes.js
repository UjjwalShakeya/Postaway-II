// importing required modules
import express from "express";
import LikeController from "./like.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const LikeRouter = express.Router();

const LikeControllerInc = new LikeController();

// adding like to an specific post
LikeRouter.post("/toggle/:id", jwtAuth, (req, res, next) =>
  LikeControllerInc.toggleLike(req, res, next)
);

// // retrieve all likes
LikeRouter.get("/:id", jwtAuth, (req, res, next) =>
  LikeControllerInc.getAllLikes(req, res, next)
);

// deleting the like on delete request
// LikeRouter.delete("/toggle/:postid", jwtAuth, (req, res, next) =>
//   LikeControllerInc.deleteLike(req, res, next)
// );

export default LikeRouter;
