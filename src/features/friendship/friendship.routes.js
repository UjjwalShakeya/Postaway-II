// imported important Packages

// Core imports
import express from "express";

// local imports
import FriendshipController from "./friendship.controller";

// Middlewares
import jwtAuth from "../../middlewares/jwt.middleware";

// creating instance
const friendsRouter = express.Router();
const friendshipController = new FriendshipController();

//  Get a user's friends.
friendsRouter.get(
  "/get-friends/:userId",
  jwtAuth,
  friendshipController.getFriendsByUserId
);

//  Get pending friend requests.
friendsRouter.get(
  "/get-pending-requests",
  jwtAuth,
  friendshipController.getPendingRequests
);

// Toggle friendship with another user.
friendsRouter.post(
  "/toggle-friendship/:friendId",
  jwtAuth,
  friendshipController.toggleFriendship
);

//  Accept or reject a friend request.
friendsRouter.post(
  "/response-to-request/:friendId",
  jwtAuth,
  friendshipController.responseToRequest
);

export default friendsRouter;
