// Post Controller

// Import required packages :-
// Application modules 
import ApplicationError from "../../../utils/ApplicationError.js";
import PostModel from "./post.model.js";
import PostRepository from "./post.respository.js";
import { ObjectId } from "mongodb";

export default class PostController {

  constructor() {
    this.postRepository = new PostRepository();
  }

  // created new post
  createPost = async (req, res, next) => {
    try {
      if (!ObjectId.isValid(req.userID)) {
        throw new ApplicationError("Invalid userID", 400);
      };
      
      const userID = new ObjectId(req.userID);

      const { caption, status } = req.body;

      if (!req.file) throw new ApplicationError("Image file is required", 400);

      if (!caption?.trim()) throw new ApplicationError("Caption field is required", 400);

      // Allow only valid statuses
      const allowedStatuses = ["published", "draft"];
      const postStatus = allowedStatuses.includes(status)
        ? status
        : "published";

      const newPost = new PostModel(
        new ObjectId(userID),
        caption.trim(),
        req.file.filename,
        postStatus
      );

      await this.postRepository.createPost(newPost);

      res.status(201).json({
        success: true,
        message: "new post has been created",
        NewPost: newPost,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  };

  // retrieve all posts
  getAllPosts = async (req, res, next) => {
    try {
      const caption = req.query.caption || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const posts = await this.postRepository.getAllPosts(page, limit, caption);

      if (!posts || posts.length == 0) throw new ApplicationError("posts not found", 400);

      res.status(200).json({
        success: true,
        message: "All posts",
        data: posts.posts,
        pagination: {
          totalPosts: posts.totalPosts,
          totalPages: posts.totalPages,
          currentPage: posts.currentPage,
        },
      });

    } catch (err) {
      next(err); // error handled by middleware
    }
  }

  // retrieve post by the id
  getPostById = async (req, res, next) => {
    try {
      const id = req.params.id;

      // Validate ID before querying
      if (!id) throw new ApplicationError("Invalid id", 400);

      const post = await this.postRepository.getPostById(id);

      if (!post) throw new ApplicationError("post not found", 404);

      res
        .status(200)
        .json({ success: true, message: "Post found by ID", data: post });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // retrieve post by the user credentials
  getPostsByUserCred = async (req, res, next) => {
    try {
      const userID = req.params.userId;
      if (!userID) throw new ApplicationError("User ID required", 400);

      const postsByUserId = await this.postRepository.getPostsByUserCred(userID);

      if (!postsByUserId) throw new ApplicationError("posts of user not found", 404);

      res
        .status(200)
        .json({ success: true, message: "Post found", data: postsByUserId });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  deletePost = async (req, res, next) => {
    try {

      const postID = req.params.postId;
      const userID = req.userID;

      if (!postID || !userID) throw new ApplicationError("Post ID And User ID Both required", 400);

      const deletedPost = await this.postRepository.deletePost(postID, userID);

      res.status(200).json({
        success: true,
        message: `post has been deleted`,
        data: deletedPost,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // update the specific post
  updatePost = async (req, res, next) => {
    try {
      const userID = req.userID;
      const postID = req.params.postId;
      const newData = req.body;

      if (!postID || !userID) throw new ApplicationError("Missing post ID or user ID", 400);
      if (newData.userId) throw new ApplicationError("you can't perform this action", 400);

      const updatedPost = await this.postRepository.updatePost(userID, postID, newData);

      if (!updatedPost) throw new ApplicationError("Post not found or update failed", 404);

      res.status(200).json({
        success: true,
        message: `${postID} post has been updated`,
        data: updatedPost,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  };
}
