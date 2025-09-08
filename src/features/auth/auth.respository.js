// importing important modules

// Core imports
import { ObjectId } from "mongodb"; 
import { getDB } from "../../config/mongodb.js";

import ApplicationError from "../../../utils/ApplicationError.js";

export default class AuthRepository {
  constructor() {
     // Name of the collection used for authentication-related data
    this.collection = "users";
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collection);
  };

  // Create a new user document in the DB
  async signUp(newUser) {
    try {
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. add new user in db
      await collection.insertOne(newUser);
      delete newUser.password;
      return newUser;

    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // Find a user by email
  async findByEmail(email) {
    try {
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. find user by mail
      const isUserFound = await collection.findOne({ email });

      return isUserFound;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // set OTP in database Document
  async setOTP(email, otp, otpExpiry) {
    try {
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. set OTP in the db
      await collection.updateOne(
        { email: email },
        { $set: { otp, otpExpiry } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // clear OTP from database Document
  async clearOTP(email) {
    try {
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. clear OTP from DB

      await collection.updateOne(
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
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. update password

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

  // add refresh token 
  async addRefreshToken(userId, refreshToken) {
    try {
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. add token
      const result = await collection.updateOne(
        { _id: userId },
        { $push: { refreshTokens: refreshToken } }
      );
      return result;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // remove refresh token from database 
  async removeRefreshToken(userId, refreshToken) {
    try {
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. remove token from DB
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
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. remove all tokens from DB
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
      // step 1. get collection
      const collection = this.getCollection();

      // step 2. find by token
      return await collection.findOne({ refreshTokens: refreshToken });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
