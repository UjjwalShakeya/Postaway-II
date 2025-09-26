// Like Controller

// Import required packages :-
// Application modules 
import ApplicationError from "../../../utils/ApplicationError.js";
import LikeRepository from "./like.respository.js";
import PostRepository from "../post/post.respository.js";

// Like Controller class
export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
    this.postRepository = new PostRepository();
  }

  // <<< Get all likes for a specific post >>>
  getAllLikes = async (req, res, next) => {
    try {
      const postId = req.params.id; // ID of the post to get likes for

      if (!postId) {
        throw new ApplicationError("Missing post ID", 400);
      }

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId); // Check if post exists

      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }
      // Fetch all likes for the post
      const allLikes = await this.likeRepository.getAllLikes(postId); // Fetch all likes
      
      if (!allLikes || allLikes.length === 0) {
        throw new ApplicationError("No likes found for this post", 404);
      }
      res.status(200).json({
        success: true,
        message: `All likes have been retrieved `,
        data: allLikes, // standardize key as `data`
      });

    } catch (err) {
      next(err); // passes to errorHandler middleware
    }
  }

  // <<< Toggle like status for a post >>>
  toggleLike = async (req, res, next) => {
    try {
      const userId = req.userID;   // ID of logged-in user
      const postId = req.params.id; // ID of the post to like/unlike

      if (!postId) {
        throw new ApplicationError("Missing post ID", 400);
      }

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);  // Check if post exists
      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }

      const existingLike = await this.likeRepository.findLike(userId, postId); // Check if user already liked
      let likeToggle = false; // Will track whether like was added or removed

      if (existingLike) {
        // If already liked → remove like
        const likeRemoved = await this.likeRepository.removeLike(
          userId,
          postId
        );
        if (!likeRemoved) {
          throw new ApplicationError("Error removing like", 400);
        }
        // likeToggle = false;
      } else {
         // If not liked → add like
        const isLikeAdded = await this.likeRepository.addLike(userId, postId);
        if (!isLikeAdded) {
          throw new ApplicationError("Error adding like", 400);
        }
        likeToggle = true;
      }
// Send response indicating action performed
      res.status(200).json({
        success: true,
        message: `${likeToggle ? "like is added" : "like is removed"}`,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }
}
