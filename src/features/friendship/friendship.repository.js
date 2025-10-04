// importing important modules
import FriendshipModel from "./friendship.model.js";
// Core imports
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";


export default class FriendshipRepository {
  constructor() {
    this.collection = "friendships";
  };

  // helper functions to validate and conver id
  validateAndConvertId(id, name = "ID") {
    if (!ObjectId.isValid(id)) throw new Error(`${name} is invalid`);
    return new ObjectId(id);
  }

  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  };

  getFriendsByUserId = async (userId) => {
    try {
      const userID = this.validateAndConvertId(userId, "User ID");

      // write you code down here
      const collection = await this.getCollection();

      return await collection.find({
        status: { $in: ['accepted'] },
        $or: [
          { userId: userID },
          { friendId: userID }
        ]
      }).toArray();
      
    } catch (err) {
      throw err;
    }
  };

  getPendingRequests = async (userId) => {
    try {
      const userID = this.validateAndConvertId(userId, "User ID");
      const collection = await this.getCollection();

      const result = await collection
        .find({ friendId: userID, status: { $in: ["pending"] } })
        .toArray();

      return result;
    } catch (err) {
      throw err;
    }
  };

  toggleFriendship = async (userId, friendId) => {
    try {
      // 1. getting db and collection
      const collection = await this.getCollection();

      const userID = this.validateAndConvertId(userId, "User ID");
      const friendID = this.validateAndConvertId(friendId, "Friend ID");

      // Check if friendship already exists
      const existingFriendship = await collection.findOne({
        $or: [
          { userId: userID, friendId: friendID },
          { userId: friendID, friendId: userID },
        ],
      });

      // Case 1: No friendship → create
      if (!existingFriendship) {
        const newFriendship = new FriendshipModel(userID, friendID, "pending");
        const result = await collection.insertOne(newFriendship);
        return {
          message: "Friendship request sent",
          data: { _id: result.insertedId, ...newFriendship },
        };
      };

      // Case 2: unfriend or cancelled → pending
      if (existingFriendship.status === "unfriend" || existingFriendship.status === "cancelled" || existingFriendship.status === "rejected") {
        const result = await collection.findOneAndUpdate(
          { _id: existingFriendship._id },
          { $set: { status: "pending" } },
          { returnDocument: "after" }
        );
        return {
          message: "Friendship request sent",
          data: result
        };
      };



      // Case 2: Pending → cancel request
      if (existingFriendship.status === "pending") {
        const result = await collection.findOneAndUpdate({ _id: existingFriendship._id },
          { $set: { status: "cancelled", updatedAt: new Date() } },
          { returnDocument: "after" } // returns the updated document
        );

        return {
          message: "Friendship request cancelled",
          data: result,
        };
      }

      // Case 3: Accepted → unfriend
      if (existingFriendship.status === "accepted") {
        const result = await collection.findOneAndUpdate(
          { _id: existingFriendship._id },
          { $set: { status: "unfriend", updatedAt: new Date() } },
          { returnDocument: "after" } // returns the updated document
        );
        return {
          message: "Friend removed",
          data: result,
        };
      }

      return {
        message: "No action taken",
        data: existingFriendship,
      };
    } catch (err) {
      throw err;
    }
  };

  responseToRequest = async (userId, friendId, action) => {
    try {
      const userID = this.validateAndConvertId(userId, "User ID");
      const friendID = this.validateAndConvertId(friendId, "Friend ID");

      // write you code down here
      const collection = await this.getCollection();
      const existingFriendship = await collection.findOne({
        $or: [
          { userId: userID, friendId: friendID },
          { userId: friendID, friendId: userID },
        ],
      });
      if (!existingFriendship) return null;

      // Case 2: Accept → update status to accepted
      if (existingFriendship.status === "pending" && action === "accept") {
        const result = await collection.findOneAndUpdate(
          { _id: existingFriendship._id },
          { $set: { status: "accepted", updatedAt: new Date() } },
          { returnDocument: "after" }
        );
        return {
          message: "Friend request accepted",
          data: result,
        };
      }

      // Case 3: Reject → the friendship
      if (existingFriendship.status === "pending" && action === "reject") {
        const result = await collection.findOneAndUpdate(
          { _id: existingFriendship._id },
          { $set: { status: "rejected", updatedAt: new Date() } },
          { returnDocument: "after" } // returns the updated document
        );

        return {
          message: "Friend request rejected",
          data: result,
        };
      }

      return {
        message: "No action taken",
        data: existingFriendship,
      };

    } catch (err) {
      throw err;
    }
  };
}
