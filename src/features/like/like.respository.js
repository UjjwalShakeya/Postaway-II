// importing important modules
import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";
import LikeModel from "./like.model.js";
import { ObjectId } from "mongodb";

export default class LikeRepository {
  constructor() {
    this.collection = "likes"
  }

  async findLike(userId, postId) {
    try {
      // 1. getting db
      const db = getDB();
      // 2. getting collection
      const collection = db.collection(this.collection);

      // 3. checking if like exist
      const likeExist = await collection.findOne({
        userId: new ObjectId(userId),
        postId: new ObjectId(postId),
      });

      return likeExist;

    } catch (err) {
      throw new ApplicationError("Error finding like: " + err.message, 500);
    }
  }

  async removeLike(userId, postId) {
    try {
      // 1. getting db
      const db = getDB();
      // 2. getting collection
      const collection = db.collection(this.collection);

      // 3. checking if like exist
      const deletedLike = await collection.deleteOne({
        userId: new ObjectId(userId),
        postId: new ObjectId(postId),
      });

      return deletedLike;
    } catch (err) {
      throw new ApplicationError("Error deleting like: " + err.message, 500);
    }
  }

  async addLike(userId, postId) {
    try {
      // 1. getting db
      const db = getDB();
      // 2. getting collection
      const collection = db.collection(this.collection);
      
      // 3. adding a like
      const newLikeObj = new LikeModel(
        new ObjectId(userId),
        new ObjectId(postId)
      );

      // 2. checking if like exist
      const newLike = await collection.insertOne(
        newLikeObj,
      );

      return newLike;
    } catch (err) {
      throw new ApplicationError("Error adding a new like: " + err.message, 500);
    }
  };

  async getAllLikes(postId) {
    try {
      // 1. getting db
      const db = getDB();
      // 2. getting collection
      const collection = db.collection(this.collection);
      
      // 3. fetching all likes for a post
      const allLikes = await collection.find({ postId: new ObjectId(postId) }).toArray();

      if (!allLikes || allLikes.length === 0) {
        throw new ApplicationError("No likes found", 404);
      }

      return allLikes;
      
    } catch (err) {
      throw new ApplicationError("Error fetching likes: " + err.message, 500);
    }
  }
}
