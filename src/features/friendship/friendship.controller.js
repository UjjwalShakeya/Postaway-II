// Repository
import FriendshipRepository from "./friendship.repository.js";
import UserRepository from "../user/user.repository.js";
import { ObjectId } from "mongodb";

// Middlewares
import ApplicationError from "../../middlewares/errorHandler.middleware.js";

export default class FriendshipController {
  constructor() {
    this.friendshipRepository = new FriendshipRepository();
    this.userRepository = new UserRepository();
  }

  getFriendsByUserId = async (req, res, next) => {
    try {
      // logic to get friends
    } catch (err) {
      next(err);
    }
  };

  getPendingRequests = async (req, res, next) => {
    try {
      // logic to get pending requests
    } catch (err) {
      next(err);
    }
  };

  toggleFriendship = async (req, res, next) => {
    try {
      // logic to toggle friendship
      const userId = new ObjectId(req.userID);

      const friendId = new ObjectId(req.params.friendId);

      if (userId.equals(friendId)) {
        throw new ApplicationError("You cannot be friends with yourself", 400);
      }

      const friend = await this.userRepository.getUser(friendId);
      if (!friend) throw new ApplicationError("Friend not found", 404);

      const result = await this.friendshipRepository.toggleFriendship(
        userId,
        friendId
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  };

  responseToRequest = async (req, res, next) => {
    try {
      // logic to respond to a friend request
      const userId = new ObjectId(req.userID);
      const friendId = new ObjectId(req.params.friendId);
      const { action } = req.body; // accept || or reject

      // Validate action
      if (!["accept", "reject"].includes(action?.toLowerCase())) {
        throw new ApplicationError(
          "Invalid action. Use: 'accept' or 'reject'",
          400
        );
      }

      const friend = await this.userRepository.getUser(friendId);
      if (!friend) throw new ApplicationError("Friend not found", 404);

      // Process request
      const result = await this.friendshipRepository.responseToRequest(
        userId,
        friendId,
        action.toLowerCase()
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      next(err);
    }
  };
}
