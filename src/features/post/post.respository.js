// Post Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// Post Repository class
export default class PostRepository {
  // Initialize collection
  constructor() {
    this.collection = "posts";
  };
  // method to get collection
  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // Create a new post
  async createPost(newPost) {
    try {
      // getting collection
      const collection = await this.getCollection();
      await collection.insertOne(newPost);
      return newPost;
    } catch (err) {
      throw err
    }
  };
  // Retrieve all posts with optional caption filter and pagination
  async getAllPosts(page, limit, caption) {
    try {
      // getting collection
      const collection = await this.getCollection();

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
      throw err
    }
  };

  // Retrieve a single post by ID
  async getPostById(postId) {
    try {
      // getting collection
      const collection = await this.getCollection();

      // find post by id
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

      return results[0] || null;

    } catch (err) {
      throw err
    }
  }

  // Retrieve all posts for a specific user
  async getPostsByUserCred(userId) {
    try {
      // getting collection
      const collection = await this.getCollection();

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
      throw err
    }
  };

  // Delete a post by ID for a specific user
  async deletePost(postID, userID) {
    try {
      // getting collection
      const collection = await this.getCollection();

      return await collection.deleteOne({
        _id: new ObjectId(postID),
        userId: new ObjectId(userID),
      });

    } catch (err) {
      throw err
    }
  }
  // Update a post by ID for a specific user
  async updatePost(userID, postID, data) {
    try {
      // getting collection
      const collection = await this.getCollection();

      return await collection.findOneAndUpdate(
        { _id: new ObjectId(postID), userId: new ObjectId(userID) },
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

    } catch (err) {
      throw err
    }
  }
}
