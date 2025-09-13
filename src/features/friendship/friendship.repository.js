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

  getPendingRequests = async (userId) => {
    try {
      // write you code down here
      const collection = await this.getCollection();

      const result = await collection
        .find({ friendId: userId, status: { $in: ["pending"] } })
        .toArray();
        return result;
    } catch (err) {
      throw err;
    }
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
      // write you code down here
      const collection = await this.getCollection();
      const existingFriendship = await collection.findOne({
        $or: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      });

      if (!existingFriendship) {
        return {
          message: "no friendship request between this friend and user",
          data: null,
        };
      }

      // Case 2: Accept → update status to accepted
      if (existingFriendship.status === "pending" && action === "accept") {
        const result = await collection.updateOne(
          {
            _id: existingFriendship._id,
          },
          {
            $set: {
              status: "accepted",
              updatedAt: new Date(),
            },
          }
        );
        return result;
      }

      // Case 3: Reject → delete the friendship
      if (existingFriendship.status === "pending" && action === "reject") {
        await collection.deleteOne({
          _id: existingFriendship._id,
        });
        return {
          message: "request rejected",
          data: existingFriendship,
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
