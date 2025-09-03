import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class PostRepository {
  constructor() {
    this.collection = "posts";
  }

  async createPost(newPost) {
    try {
      // getting db access
      const db = getDB();

      // getting collection access
      const collection = db.collection(this.collection);

      await collection.insertOne(newPost);

      return newPost;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAllPosts(page, limit, caption) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      // Convert to numbers safely
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);

      // Build query
      const query = { status: { $nin: ["draft", "archived"] } };

      if (caption && caption.trim() !== "") {
        query.caption = { $regex: caption, $options: "i" }; // case-insensitive
      }

      // Count total
      const totalPosts = await collection.countDocuments(query);

      // Fetch posts with pagination
      const posts = await collection
        .find(query)
        .sort({ createdAt: -1 }) // newest first (optional)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .toArray();

      return {
        posts,
        totalPosts,
        totalPages: totalPosts ? Math.ceil(totalPosts / limitNum) : 0,
        currentPage: pageNum,
      };
    } catch (err) {
      throw new ApplicationError("Error fetching posts: " + err.message, 500);
    }
  }
  async getPostById(postId) {
    try {
      // 1. getting db
      const db = getDB();
      // 2. getting collection
      const collection = db.collection(this.collection);
      // 3. find post by id
      // Aggregation pipeline
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(postId),
            status: { $nin: ["draft", "archived"] }, // exclude drafts and archived directly
          },
        },
        {
          $limit: 1, // ensure only one doc is returned
        },
      ];

      const results = await collection.aggregate(pipeline).toArray();

      return results;
    } catch (err) {
      throw new ApplicationError(
        "Error fetching post by postId: " + err.message,
        500
      );
    }
  }

  async getPostsByUserCred(userId) {
    try {
      // 1. getting db
      const db = getDB();

      // 2. getting collection
      const collection = db.collection(this.collection);

      // Aggregation pipeline
      const pipeline = [
        {
          $match: {
            userId: userId,
            status: { $nin: ["draft", "archived"] },
          },
        },
      ];

      return await collection.aggregate(pipeline).toArray();
    } catch (err) {
      throw new ApplicationError(
        "Error fetching post by user: " + err.message,
        500
      );
    }
  }
  async deletePost(postID, userID) {
    try {
      // getting database
      const db = getDB();

      // getting collection
      const collection = db.collection(this.collection);

      const result = await collection.deleteOne({
        _id: new ObjectId(postID),
        userId: userID,
      });

      if (result.deletedCount === 0)
        throw new ApplicationError("No matching post found to delete", 404);

      return result;
    } catch (err) {
      throw new ApplicationError("Error deleting Post: " + err.message, 500);
    }
  }
}
