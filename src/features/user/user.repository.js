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
  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  }

  // <<< Get user by ID (no passwords) >>>
  getUser = async (userId) => {
    try {
      const collection = await this.getCollection();

      const user = await collection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { _id: 1, name: 1, gender: 1, email: 1, avatar: 1 } }
      );
      return user;
    } catch (err) {
      throw err;
    }
  }
  // <<< Get all users (no passwords) >>>
  getAllUsers = async (page, limit) => {
    try {
      const collection = await this.getCollection();

      // Make sure they're at least 1 (in case someone sends 0 or negative)
      const pageNum = Math.max(1, page);
      const limitNum = Math.max(1, limit);

      // Query (you can add filters later if needsed)
      const query = {};

      // counting how many users are there
      const totalUsers = await collection.countDocuments(query);

      const users = await collection
        .find(query, { projection: { _id: 1, name: 1, gender: 1, email: 1, avatar: 1 } })
        .skip((pageNum - 1) * limitNum).limit(limitNum).toArray();
        
      return {
        users,
        totalUsers,
        totalPages: totalUsers ? Math.ceil(totalUsers / limitNum) : 0,
        currentPage: pageNum,
      };

    } catch (err) {
      throw err;
    }
  }

  // <<< Update user by ID (no passwords) >>>
  updateUserById = async (userId, data) => {
    try {
      const collection = await this.getCollection();

      const updatedUser = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: data },
        {
          returnDocument: "after",
          projection: { _id: 1, name: 1, gender: 1, email: 1, avatar: 1 },
        }
      );
      return updatedUser.value;
    } catch (err) {
      throw err;
    }
  }
}
