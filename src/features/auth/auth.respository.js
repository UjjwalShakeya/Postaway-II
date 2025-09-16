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
  }

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
      if (err.code === 11000) {
        throw new ApplicationError("Email already exists", 409);
      }
      throw new ApplicationError("Database error in signUp", 500);
    }
  }

  // Find a user by email
  async findByEmail(email) {
    const collection = this.getCollection();

    // find user by mail
    return await collection.findOne(
      { email },
      {
        projection: {
          password: 1,
          name: 1,
          email: 1,
          gender: 1,
          otp: 1,
          otpExpiry: 1,
          refreshTokens: 1,
        },
      }
    );
  }

  // set OTP in database Document
  async setOTP(email, otp, otpExpiry) {
    try {
      const collection = this.getCollection();

      // set OTP in the db
      const result = await collection.updateOne(
        { email: email },
        { $set: { otp, otpExpiry } }
      );
      return result.modifiedCount;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // clear OTP from database Document
  async clearOTP(email) {
    try {
      const collection = this.getCollection();
      // clear OTP from DB

      await collection.updateOne(
        { email: email },
        { $unset: { otp: 1, otpExpiry: 1 } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  // Update password after OTP verified
  async updatePassword(email, newPassword) {
    try {
      const collection = this.getCollection();

      // update password

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
      const collection = this.getCollection();

      // add token
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
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
      const collection = this.getCollection();

      // remove token from DB
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
      const collection = this.getCollection();

      // remove all tokens from DB
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { refreshTokens: [] } }
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByRefreshToken(refreshToken) {
    const collection = this.getCollection();
    // find by token
    return await collection.findOne({ refreshTokens: refreshToken });
  }
}
