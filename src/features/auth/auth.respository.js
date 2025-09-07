// importing important modules
import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class AuthRepository {
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
  async setOTP(email, otp, otpExpiry) {
    try {
      // 1. get db
      const db = getDB();

      // 2. get collection
      const collection = db.collection(this.collection);

      collection.updateOne({ email: email }, { $set: { otp, otpExpiry } });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async clearOTP(email) {
    try {
      // 1. get db
      const db = getDB();

      // 2. get collection
      const collection = db.collection(this.collection);

      collection.updateOne(
        { email: email },
        { $unset: { otp: "", otpExpiry: "" } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // Update password after OTP verified
  async updatePassword(email, newPassword) {
    try {
      // 1. get db
      const db = getDB();
      // 2. get collection
      const collection = db.collection(this.collection);

      return await collection.updateOne(
        { email },
        {
          $set: { password: newPassword },
          $unset: { otp: "", otpExpiry: "" },
        }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async addRefreshToken(userId, refreshToken) {
    try {
      // getting the access of the db
      const db = getDB();

      const collection = db.collection(this.collection);
      await collection.updateOne(
        { _id: userId },
        { $push: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async removeRefreshToken(userId, refreshToken) {
    try {
      // getting the access of the db
      const db = getDB();

      // getting the access of the collection
      const collection = db.collection(this.collection);
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async removeAllRefreshToken(userId) {
    try {
      // getting the access of the db
      const db = getDB();

      // getting the access of the collection
      const collection = db.collection(this.collection);

      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { refreshTokens: [] } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByRefreshToken(refreshToken) {
    try {
      // getting the access of the db
      const db = getDB();

      // getting the access of the collection
      const collection = db.collection(this.collection);

      return await collection.findOne({ refreshTokens: refreshToken });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
