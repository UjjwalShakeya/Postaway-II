// User Repository

// Import required packages :-
// Application modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

// User Repository class
export default class UserRepository {
  // Initialize collection
  constructor() {
    this.collection = "users";
  }
  // method to get collection
  getCollection() {
    const db = getDB();
    return db.collection(this.collection);
  }

  // <<< Get user by ID (no passwords) >>>
  async getUser(userId) {
    try {
      const collection = this.getCollection();

      const user = await collection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { _id: 1, name: 1, gender: 1, email: 1 } }
      );
      return user;
    } catch (err) {
      throw err;
    }
  }
  // <<< Get all users (no passwords) >>>
  async getAllUsers() {
    try {
      const collection = this.getCollection();

      const allUsers = await collection
        .find({}, { projection: { _id: 1, name: 1, gender: 1, email: 1 } })
        .toArray();

      return allUsers;
    } catch (err) {
      throw err;
    }
  }

  // <<< Update user by ID (no passwords) >>>
  async updateUserById(userId, data) {
    try {
      const collection = this.getCollection();

      const updatedUser = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: data },
        {
          returnDocument: "after",
          projection: { _id: 1, name: 1, gender: 1, email: 1 },
        }
      );
      return updatedUser.value;
    } catch (err) {
      throw err;
    }
  }
}
