// Comment Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// Comment Repository class
export default class CommentRepository {
  // Initialize collection
  constructor() {
    this.collection = "comments";
  }

  // method to get collection
  getCollection = () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // <<< create a freshly new comment >>>
  createComment = async (data) => {
    try {
      // 1. getting collection
      const collection = this.getCollection();

      // 2. creating comment
      await collection.insertOne(data);
      return data;

    } catch (err) {
      throw err;
    }
  }

  // <<< getting comments of an specific post >>>
  getAllPostComments = async (postId, page, limit) => {
    try {

      // 1. getting collection
      const collection = this.getCollection();

      const skip = (page - 1) * limit;

      // 2. Fetch comments with pagination
      const comments = await collection
        .find({ postId: postId })
        .skip(skip)
        .limit(limit)
        .toArray();

      // 3. Count total comments for pagination metadata
      const totalComments = await collection.countDocuments({ postId: postId });
      return {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
      };
    } catch (err) {
      throw err;
    }
  }

  // <<< deleting specific comment of an specific user >>>
  deleteComment = async (id, userId) => {
    try {
      // 1. getting collection
      const collection = this.getCollection();

      return await collection.deleteOne({
        _id: new ObjectId(id),
        userId: userId,
      });

    } catch (err) {
      throw err;
    }
  }

  // <<< updating a specific comment of an specific post  >>>
  updateComment = async (commentId, userId, comment) => {
    try {
      // 1. getting collection
      const collection = this.getCollection();

      return await collection.updateOne(
        {
          _id: new ObjectId(commentId),
          userId: userId,
        },
        { $set: { comment } }
      );

    } catch (err) {
      throw err;
    }
  }
}
