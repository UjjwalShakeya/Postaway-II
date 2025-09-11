// importing important modules
import FriendshipModel from "./friendship.model.js";

// Core imports
import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class FriendshipRepository {
  constructor() {
    this.collection = "friendships";
  }

  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  getFriendsByUserId = async () => {
    try {
      // write you code down here
    } catch (err) {}
  };

  getPendingRequests = async () => {
    try {
      // write you code down here
    } catch (err) {}
  };

  toggleFriendship = async (userId, friendId) => {
    try {
      // write you code down here
      // 1. getting db and collection
      const collection = await this.getCollection(this.collection);

      // Check if friendship already exists
      const existingFriendship = await collection.findOne({
        $or: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      });

      // Case 1: No friendship → create
      if (!existingFriendship) {
        const newFriendship = new FriendshipModel(userId, friendId, "pending");
        const result = await collection.insertOne(newFriendship);

        return {
          message: "Friendship request sent",
          data: { ...newFriendship, _id: result.insertedId },
        };
      }

      // Case 2: Pending → cancel request
      if (existingFriendship.status === "pending") {
        await collection.deleteOne({ _id: existingFriendship._id });
        return {
          message: "Friendship request cancelled",
          data: existingFriendship,
        };
      }

      // Case 3: Accepted → unfriend
      if (existingFriendship.status === "accepted") {
        await collection.deleteOne({ _id: existingFriendship._id });
        return {
          message: "Friend removed",
          data: existingFriendship,
        };
      };
      
      return {
        message: "No action taken",
        data: existingFriendship,
      };
    } catch (err) {
      throw err;
    }
  };

  responseToRequest = async () => {
    try {
      // write you code down here
    } catch (err) {}
  };
}
