// importing required modules
import ApplicationError from "../../../utils/ApplicationError.js";
import LikeRepository from "./like.respository.js";
import PostRepository from "../post/post.respository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
    this.postRepository = new PostRepository();
  }

  async getAllLikes(req, res, next) {
    try {
      const postId = req.params.id;

      if (!postId) {
        throw new ApplicationError("Missing post ID", 400);
      }
      
      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);
      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }
      // Fetch all likes for the post
      const allLikes = await this.likeRepository.getAllLikes(postId);

      res.status(200).json({
        success: true,
        message: `All likes have been retrieved `,
        data: allLikes, // standardize key as `data`
      });
    } catch (err) {
      next(err); // passes to errorHandler middleware
    }
  }

  async toggleLike(req, res, next) {
    try {
      const userId = req.userID;
      const postId = req.params.id;

      if (!postId) {
        throw new ApplicationError("Missing post ID", 400);
      }

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);
      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }

      const existingLike = await this.likeRepository.findLike(userId, postId);
      let likeToggle = false;

      if (existingLike) {
        const likeRemoved = await this.likeRepository.removeLike(
          userId,
          postId
        );
        if (!likeRemoved) {
          throw new ApplicationError("Error removing like", 400);
        }
        // likeToggle = false;
      } else {
        const isLikeAdded = await this.likeRepository.addLike(userId, postId);
        if (!isLikeAdded) {
          throw new ApplicationError("Error adding like", 400);
        }
        likeToggle = true;
      }

      res.status(200).json({
        success: true,
        message: `${likeToggle ? "like is added" : "like is removed"}`,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // async deleteLike(req, res, next) {
  //   try {
  //     const userId = req.userID;
  //     const postId = parseInt(req.params.postid);

  //     if (isNaN(postId)) {
  //       throw new ApplicationError("Invalid post ID", 400);
  //     }

  //     const deletedLike = await LikeModel.delete(userId, postId);

  //     res.status(200).json({
  //       success: true,
  //       message: `like of user ${userId} is removed `,
  //       data: deletedLike,
  //     });
  //   } catch (err) {
  //     next(err); // calling next with error, error will be caught by errorhandler Middleware
  //   }
  // }
}
