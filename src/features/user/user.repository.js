// importing important modules

import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }

  async getUser(userId) {
    try {
      // step1. getting dbs
      const db = getDB();

      // step2. getting the collection
      const collection = db.collection(this.collection);

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
      // step1. getting dbs
      const db = getDB();

      // step2. getting the collection
      const collection = db.collection(this.collection);

      const allUsers = await collection
        .find({}, { projection: { name: 1 } })
        .toArray();

      return allUsers;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
