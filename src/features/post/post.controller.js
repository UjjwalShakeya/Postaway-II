// importing required modules
import ApplicationError from "../../../utils/ApplicationError.js";
import PostModel from "./post.model.js";
import PostRepository from "./post.respository.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  // created new post
  async createPost(req, res, next) {
    try {
      const userID = req.userID;
      const { caption, status } = req.body;

      if (!req.file) new ApplicationError("Image file is required", 400);

      if (!caption || caption.trim() === "")
        throw new ApplicationError("Caption field is required", 400);

      // Allow only valid statuses
      const allowedStatuses = ["published", "draft"];
      const postStatus = allowedStatuses.includes(status)
        ? status
        : "published";

      const newPost = new PostModel(
        userID,
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
  }

  // // retrieve all posts
  async getAllPosts(req, res, next) {
    try {
      const caption = req.query.caption || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const posts = await this.postRepository.getAllPosts(page, limit, caption);

      if (!posts) throw new ApplicationError("post not found", 400);

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
  async getPostById(req, res, next) {
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
  async getPostsByUserCred(req, res, next) {
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

  async deletePost(req, res, next) {
    try {

      const postID = req.params.postId;
      const userID = req.userID;

      if (!postID || !userID) throw new ApplicationError("Post ID And User ID Both required", 400);
      
      const deletedPost = await this.postRepository.deletePost(postID,userID);

      res.status(200).json({
        success: true,
        message: `post has been deleted`,
        data: deletedPost,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // // retrieve filtered posts
  // async getFilteredPosts(req, res, next) {
  //   try {
  //     const { caption } = req.query;
  //     if (!caption) {
  //       return res.status(400).json({ message: "Caption query is required" });
  //     }
  //     const filteredPosts = await PostModel.filter(req.query.caption);

  //     if (!filteredPosts || filteredPosts.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ message: "No posts found with given caption" });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "Filtered posts retrieved successfully",
  //       data: filteredPosts,
  //     });
  //   } catch (err) {
  //     next(err); // calling next with error, error will be caught by errorhandler Middleware
  //   }
  // }

  // // update the specific post
  // async updatePost(req, res, next) {
  //   try {
  //     const userID = req.userID;
  //     const postID = parseInt(req.params.id);
  //     const newData = req.body;

  //     if (!postID || !userID)
  //       throw new ApplicationError("Missing post ID or user ID", 400);

  //     const updatedPost = await PostModel.update(userID, postID, newData);

  //     res.status(200).json({
  //       success: true,
  //       message: `${postID} post has been updated`,
  //       data: updatedPost,
  //     });
  //   } catch (err) {
  //     next(err); // calling next with error, error will be caught by errorhandler Middleware
  //   }
  // }

  
  // // update the specific post status
  // async postStatus(req, res, next) {
  //   try {
  //     const postID = parseInt(req.params.id);
  //     const userID = req.userID;
  //     const { status } = req.body;

  //     if (!postID || postID <= 0 || !userID) {
  //       throw new ApplicationError("Missing post ID or user ID", 400);
  //     }

  //     if (!status) {
  //       throw new ApplicationError("Status field is required", 400);
  //     }

  //     const isPostStatusUpdated = await PostModel.updateStatus(
  //       userID,
  //       postID,
  //       status
  //     );
  //     res
  //       .status(200)
  //       .json({
  //         success: true,
  //         message: `Post ${postID} status updated successfully`,
  //         data: isPostStatusUpdated,
  //       });
  //   } catch (err) {
  //     next(err); // calling next with error, error will be caught by errorhandler Middleware
  //   }
  // }


  // // Implement sorting of posts based on user engagement and date
  // async getSortedPosts(req, res, next) {
  //   try {
  //     const allowedSorts = ["engagement", "date"];
  //     const sortBy = allowedSorts.includes(req.query.sortBy)
  //       ? req.query.sortBy
  //       : "engagement";
  //     console.log(sortBy);

  //     const sortedPosts = await PostModel.getPostsSorted(sortBy);

  //     res.status(200).json({
  //       success: true,
  //       message: `Sorted posts by ${sortBy}`,
  //       data: sortedPosts,
  //     });
  //   } catch (err) {
  //     next(err); // calling next with error, error will be caught by errorhandler Middleware
  //   }
  // }
}
