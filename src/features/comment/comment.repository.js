// importing important modules
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../../utils/ApplicationError.js";
import { ObjectId } from "mongodb";

export default class CommentRepository {
  constructor() {
    this.collection = "comments";
  }

  async createComment(data) {
    try {
      // 1. getting db
      const db = getDB();
      // 2. getting collection
      const collection = db.collection(this.collection);

      // 3. creating comment
      await collection.insertOne(data);
      return data;

    } catch (err) {
      throw new ApplicationError("Error creating a post: " + err.message, 500);
    }
  }

  async getAllPostComments(postId, page, limit) {
    try {
      // getting db
      const db = getDB();
      const collection = db.collection(this.collection);
      const skip = (page - 1) * limit;

      // Fetch comments with pagination
      const comments = await collection
        .find({ postId: postId })
        .skip(skip)
        .limit(limit)
        .toArray();

      // Count total comments for pagination metadata
      const totalComments = await collection.countDocuments({ postId: postId });
      return {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
      };
    } catch (err) {
      throw new ApplicationError(
        "Error fetching comments: " + err.message,
        500
      );
    }
  }

  async deleteComment(id, userId) {
    try {
      // 1. getting db
      const db = getDB();

      // 2. getting collection
      const collection = db.collection(this.collection);

      return await collection.deleteOne({
        _id: new ObjectId(id),
        userId: userId,
      });


    } catch (err) {
      throw new ApplicationError(
        "Error deleting comments: " + err.message,
        500
      );
    }
  }

  async updateComment(commentId, userId, comment) {
    try {
      // 1. getting db
      const db = getDB();

      // 2. getting collection
      const collection = db.collection(this.collection);

      return await collection.updateOne(
        {
          _id: new ObjectId(commentId),
          userId: userId,
        },
        { $set: {comment} }
      );

    } catch (err) {
      throw new ApplicationError(
        "Error updating comment: " + err.message,
        500
      );
    }
  }
}
