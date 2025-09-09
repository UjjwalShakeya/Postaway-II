// importing important modules

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

  toggleFriendship = async () => {
    try {
      // write you code down here
    } catch (err) {}
  };

  responseToRequest = async () => {
    try {
      // write you code down here
    } catch (err) {}
  };
}
