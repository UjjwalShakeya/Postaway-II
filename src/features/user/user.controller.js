// importing importand required modules

import ApplicationError from "../../../utils/ApplicationError.js";

// repositories
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  getUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;

      // Double-check input
      if (!userId) {
        throw new ApplicationError("User ID is missing", 400);
      }

      const user = await this.userRepository.getUser(userId);

      return res.status(200).json({
        message: "user details retrieved successfully",
        user,
      });
    } catch (err) {
      next(err);
    }
  };
  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userRepository.getAllUsers();

      return res.status(200).json({
        message: "all users details retrieved successfully",
        users,
      });
    } catch (err) {
      next(err);
    }
  };

  updateUserById = async(req, res, next)=> {
    try {
      const userId = req.params.userId;
      const name = req.body.name;
      const gender = req.body.gender;

      if (!userId) {
        throw new ApplicationError("User ID is required", 400);
      }

      const updateData = {};

      // Validate and add name if provided

      if (name !== undefined) {
        if (!name || typeof name !== "string" || !name.trim()) {
          throw new ApplicationError("Valid name is required", 400);
        }
        updateData.name = name.trim();
      }

      // Validate and add gender if provided
      if (gender !== undefined) {
        const allowedGenders = ["male", "female", "other"];
        if (!allowedGenders.includes(gender.toLowerCase())) {
          throw new ApplicationError(
            `Gender must be one of: ${allowedGenders.join(", ")}`,
            400
          );
        }
        updateData.gender = gender.toLowerCase();
      }

      // If no fields provided at all
      if (Object.keys(updateData).length === 0) {
        throw new ApplicationError(
          "At least one field (name or gender) is required",
          400
        );
      }

      const updatedUser = await this.userRepository.updateUserById(
        userId,
        updateData
      );
      if (!updatedUser) {
        throw new ApplicationError("User not found or not updated", 404);
      }
      return res.status(200).json({
        message: "User details updated successfully",
        updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
}
