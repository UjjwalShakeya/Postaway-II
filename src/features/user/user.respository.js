// importing important modules
import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class UserRepository {
  constructor() {
    this.collection = "users";
  }

  // signUp respository
  async signUp(newUser) {
    try {
      // step 1. get database
      const db = getDB();

      // step 2. get collection
      const collection = db.collection(this.collection);

      // step 3. get collection
      await collection.insertOne(newUser);

      delete newUser.password;

      return newUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      const isUserFound = await collection.findOne({ email });

      return isUserFound;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async setResetToken(email, token, expiry) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      await collection.updateOne(
        { email },
        { $set: { resetToken: token, resetTokenExpiry: expiry } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByResetToken(token) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.findOne({ resetToken: token });
      
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async updatePasswordWithToken(token, newPassword) {
    try {
      const db = getDB();

      const collection = db.collection(this.collection);

      return await collection.updateOne(
        { resetToken: token },
        {
          $set: { password: newPassword },
          $unset: { resetToken: "", resetTokenExpiry: "" },
        }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
