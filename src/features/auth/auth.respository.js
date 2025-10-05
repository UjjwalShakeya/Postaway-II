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

  getCollection = async () => {
    const db = getDB();
    return db.collection(this.collection);
  }

  findById = async (userId) => {
    try {
      const collection = await this.getCollection();

      const user = await collection.findOne({ _id: new ObjectId(userId) });

      return user;

    } catch (err) {
      throw err;
    }
  }

  incrementTokenVersion = async (userId) => {
    try {
      const collection = await this.getCollection();

      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $inc: { tokenVersion: 1 } }
      );
      return true;
    } catch (err) {
      throw err;
    }
  }

  // Create a new user document in the DB
  signUp = async (newUser) => {
    try {
      // step 1. get collection
      const collection = await this.getCollection();
      
      newUser.tokenVersion = 0;
      
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
  findByEmail = async (email) => {
    const collection = await this.getCollection();

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
          resetToken: 1,
          resetTokenExpiry: 1,
          tokenVersion: 1
        },
      }
    );
  };


  // set OTP in database Document
  setOTP = async (email, otp, otpExpiry) => {
    try {
      const collection = await this.getCollection();

      // set OTP in the db
      return await collection.updateOne(
        { email },
        { $set: { otp, otpExpiry } }
      );
    } catch (err) {
      throw err;
    }
  }

  setResetToken = async (email, resetToken, resetTokenExpiry) => {
    try {
      const collection = await this.getCollection();
      return await collection.updateOne(
        { email },
        {
          $set: { resetToken, resetTokenExpiry }
        });

    } catch (err) {
      throw err;
    }
  }

  // clear OTP from database Document
  clearOTP = async (email) => {
    try {
      const collection = await this.getCollection();
      // clear OTP from DB

      return await collection.updateOne(
        { email },
        { $unset: { otp: 1, otpExpiry: 1 } }
      );
    } catch (err) {
      throw err;
    }
  }

  // Update password after OTP verified
  updatePassword = async (email, newPassword) => {
    try {
      const collection = await this.getCollection();

      // update password

      return await collection.updateOne(
        { email },
        {
          $set: { password: newPassword },
          $unset: { resetToken: 1, resetTokenExpiry: 1, otp: 1, otpExpiry: 1 },
        }
      );
    } catch (err) {
      throw err;
    }
  };

  // add refresh token
  addRefreshToken = async (userId, refreshToken) => {
    try {
      const collection = await this.getCollection();

      // add token
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { refreshTokens: refreshToken } }
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  // remove refresh token from database
  removeRefreshToken = async (userId, refreshToken) => {
    try {
      const collection = await this.getCollection();

      // remove token from DB
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { refreshTokens: refreshToken } }
      );
    } catch (err) {
      throw err;
    }
  }

  removeAllRefreshToken = async (userId) => {
    try {
      const collection = await this.getCollection();

      // remove all tokens from DB
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { refreshTokens: [] } }
      );
    } catch (err) {
      throw err;

    }
  }

   findByRefreshToken = async(refreshToken)=> {
    try {
      const collection = await this.getCollection();
      // find by token
      return await collection.findOne({ refreshTokens: refreshToken });
    } catch (err) {
      throw err;
    }

  }
}
