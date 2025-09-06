// importing required modules
import CommentModel from "../comment/comment.model.js";
import ApplicationError from "../../../utils/ApplicationError.js";
import PostRepository from "../post/post.respository.js";
import CommentRepository from "./comment.repository.js";

export default class CommentController {
  constructor() {
    // this.commentRepository =
    this.postRepository = new PostRepository();
    this.commentRepository = new CommentRepository();
  }

  async getAllPostComments(req, res, next) {
    try {
      const postId = req.params.postId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      if (!postId) throw new ApplicationError("Invalid post ID", 400);

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);

      if (!postExists) {
        throw new ApplicationError("post not found", 404);
      }

      if (postExists.status == "draft" || postExists.status == "archived") {
        throw new ApplicationError("not allowed to comment on this post", 400);
      }

      const result = await this.commentRepository.getAllPostComments(
        postId,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        message: `comments for Post ${postId}`,
        comments: result.comments,
        pagination: {
          totalPosts: result.totalComments,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        },
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  async createComment(req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.userID;
      const { comment } = req.body;

      if (!postId) throw new ApplicationError("Invalid post ID", 400);

      if (!comment || comment.trim() === "") {
        throw new ApplicationError("Comment content cannot be empty", 400);
      }

      // Check if post exists
      const postExists = await this.postRepository.getPostById(postId);

      if (!postExists) {
        throw new ApplicationError("Post not found", 404);
      }

      const commentObj = new CommentModel(userId,postId, comment);
      const newComment = await this.commentRepository.createComment(commentObj);

      res.status(201).json({
        success: true,
        message: "New Comment has been added for Post",
        data: newComment,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  async deleteComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const userID = req.userID;

      if (!commentId) {
        throw new ApplicationError("Missing commnet ID", 400);
      }

      const deletedComment = await this.commentRepository.deleteComment(commentId, userID);

      res.status(200).json({
        success: true,
        message: `Comment ${commentId} has been deleted`,
        deletedComment,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  async updateComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const { comment } = req.body;
      const userId = req.userID;

      if (!commentId) {
        throw new ApplicationError("Missing comment ID", 400);
      }

      if (!comment || comment.trim() === "") {
        throw new ApplicationError("Comment content cannot be empty", 400);
      }

      const updatedComment = await this.commentRepository.updateComment(
        commentId,
        userId,
        comment, 
      );

      res.status(200).json({
        success: true,
        message: `You comment with id ${commentId} has been updated`,
        data: updatedComment,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }
}
