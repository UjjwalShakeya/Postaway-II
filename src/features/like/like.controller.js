// importing required modules
import LikeModel from "./like.model.js";
import ApplicationError from "../../../utils/ApplicationError.js";

export default class LikeController {
  async getAllLikes(req, res, next) {
    try {
      const postId = parseInt(req.params.postid);

      if (isNaN(postId)) {
        throw new ApplicationError("Invalid post ID", 400);
      }
      const allLikes = await LikeModel.getAll(postId);

      res.status(200).json({
        success: true,
        message: `All likes have been retrieved from specific post`,
        data: allLikes, // standardize key as `data`
      });
    } catch (err) {
      next(err); // passes to errorHandler middleware
    }
  }

  async addLike(req, res, next) {
    try {
      const userId = req.userID;
      const postId = parseInt(req.params.postid);

      if (isNaN(postId)) {
        throw new ApplicationError("Invalid post ID", 400);
      }

      const newLike = await LikeModel.add(userId, postId);
      res.status(200).json({
        success: true,
        message: `like is added to ${postId}`,
        data: newLike,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  async deleteLike(req, res, next) {
    try {
      const userId = req.userID;
      const postId = parseInt(req.params.postid);

      if (isNaN(postId)) {
        throw new ApplicationError("Invalid post ID", 400);
      };

      const deletedLike = await LikeModel.delete(userId, postId);
      
      res.status(200).json({
        success: true,
        message: `like of user ${userId} is removed `,
        data: deletedLike,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }
}
