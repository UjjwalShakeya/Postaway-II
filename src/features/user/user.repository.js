// importing important modules

import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId, ReturnDocument } from "mongodb";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collection);
  }

  async getUser(userId) {
    try {
      const collection = this.getCollection();

      const user = await collection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { name: 1 } }
      );
      return user;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAllUsers() {
    try {
      const collection = this.getCollection();

      const allUsers = await collection
        .find({}, { projection: { name: 1 } })
        .toArray();

      return allUsers;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async updateUserById(userId, data) {
    try {
      const collection = this.getCollection();

      const updatedUser = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: data },
        { returnDocument: "after", projection: { name: 1, gender: 1 } }
      );
      return updatedUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
