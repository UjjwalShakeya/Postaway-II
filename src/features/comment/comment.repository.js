// Comment Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import CommentModel from "../comment/comment.model.js";


// Comment Repository class
export default class CommentRepository {
  // Initialize collection
  constructor() {
    this.collection = "comments";
  }

  // method to get collection
  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // <<< create a freshly new comment >>>
  createComment = async (userId, postId, comment) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection();
      const newComment = new CommentModel(new ObjectId(userId), new ObjectId(postId), comment);
      // 2. creating comment
      await collection.insertOne(newComment);
      return newComment;

    } catch (err) {
      throw err;
    }
  }

  // <<< getting comments of an specific post >>>
  getAllPostComments = async (postId, page, limit) => {
    try {

      // Convert to numbers safely
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);

      // 1. getting collection
      const collection = await this.getCollection();

      const skip = (pageNum - 1) * limitNum;

      // 2. Fetch comments with pagination
      const comments = await collection
        .find({ postId: new ObjectId(postId) })
        .skip(skip)
        .limit(limitNum)
        .toArray();

      // 3. Count total comments for pagination metadata
      const totalComments = await collection.countDocuments({ postId: new ObjectId(postId) });

      return {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments / limitNum),
        currentPage: pageNum,
      };
    } catch (err) {
      throw err;
    }
  }

  // <<< deleting specific comment of an specific user >>>
  deleteComment = async (id, userId) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection();

      return await collection.deleteOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });

    } catch (err) {
      throw err;
    }
  }

  // <<< updating a specific comment of an specific post  >>>
  updateComment = async (commentId, userId, comment) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection();

      return await collection.updateOne(
        {
          _id: new ObjectId(commentId),
          userId: new ObjectId(userId),
        },
        { $set: { comment } }
      );

    } catch (err) {
      throw err;
    }
  }
}
