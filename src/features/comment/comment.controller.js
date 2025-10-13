// Comment Controller

// Import required packages :-
// Application modules 
import ApplicationError from "../../../utils/ApplicationError.js";
import PostRepository from "../post/post.respository.js";
import CommentRepository from "./comment.repository.js";

// Comment Controller class
export default class CommentController {
  constructor() {
    this.postRepository = new PostRepository();
    this.commentRepository = new CommentRepository();
  }

  // <<< Get all comments for a specific post >>>
  getAllPostComments = async (req, res, next) => {
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

      const result = await this.commentRepository.getAllPostComments(
        postId,
        page,
        limit
      );

      if (!result.comments || result.totalComments === 0) {
        throw new ApplicationError("No comments found for this post", 404);
      }

      res.status(200).json({
        success: true,
        message: `comments for Post ${postId}`,
        comments: result.comments,
        pagination: {
          totalComments: result.totalComments,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        },
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // <<< Create a new comment for a specific post >>>
  createComment = async (req, res, next) => {
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

      const newComment = await this.commentRepository.createComment(userId, postId, comment);

      if (!newComment) {
        throw new ApplicationError("error adding comment to post", 400);
      }

      res.status(201).json({
        success: true,
        message: "New Comment has been added for Post",
        data: newComment,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // <<< delete a specific comment >>>
  deleteComment = async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const userID = req.userID;

      if (!commentId) {
        throw new ApplicationError("Missing commnet ID", 400);
      }

      const deletedComment = await this.commentRepository.deleteComment(commentId, userID);

      if (!deletedComment || deletedComment.deletedCount <= 0) {
        throw new ApplicationError(
          `Comment not found with this id ${commentId}`,
          400
        );
      };

      res.status(200).json({
        success: true,
        message: `Comment ${commentId} has been deleted`,
        deletedComment,
      });
    } catch (err) {
      next(err); // calling next with error, error will be caught by errorhandler Middleware
    }
  }

  // <<< update a specific comment >>>
  updateComment = async (req, res, next) => {
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
      if (!updatedComment || updatedComment.modifiedCount <= 0) {
        throw new ApplicationError(
          "Something went wrong updating comment",
          500
        );
      }

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
