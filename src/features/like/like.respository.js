// like Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import LikeModel from "./like.model.js";
import { ObjectId } from "mongodb";

// Like Repository class
export default class LikeRepository {
  // Initialize collection
  constructor() {
    this.collection = "likes"
  };

  // method to get collection
  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  // <<< Find a like by userId and postId >>>
  findLike = async (userId, postId) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection();

      // 2. checking if like exist
      return await collection.findOne({
        userId: new ObjectId(userId),
        postId: new ObjectId(postId),
      });

    } catch (err) {
      throw err;
    }
  }
  // <<< Remove a like >>>
  removeLike = async (userId, postId) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection();

      // 2. checking if like exist
      return await collection.deleteOne({
        userId: new ObjectId(userId),
        postId: new ObjectId(postId),
      });
      
    } catch (err) {
      throw err
    }
  }
  // <<< Add a new like >>>
  addLike = async (userId, postId) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection()

      // 2. adding a like
      const newLikeObj = new LikeModel(
        new ObjectId(userId),
        new ObjectId(postId)
      );

      // 3. checking if like exist
      return await collection.insertOne(
        newLikeObj,
      );

    } catch (err) {
      throw err
    }
  };
  // <<< Get all likes for a specific post >>>
  getAllLikes = async (postId) => {
    try {
      // 1. getting collection
      const collection = await this.getCollection()

      // 2. fetching all likes for a post
      const allLikes = await collection.find({ postId: new ObjectId(postId) }).toArray();
      return allLikes;

    } catch (err) {
      throw err
    }
  }
}
