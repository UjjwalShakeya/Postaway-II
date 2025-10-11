// User Controller

// Import required packages :-
// Application modules
import UserRepository from "./user.repository.js";
import ApplicationError from "../../../utils/ApplicationError.js";

// User Controller class
export default class UserController {
  // Initialize repository
  constructor() {
    this.userRepository = new UserRepository();
  }
  // <<< Get user details by ID (no passwords) >>>
  getUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;

      // Double-check input
      if (!userId) {
        throw new ApplicationError("User ID is missing", 400);
      }

      const user = await this.userRepository.getUser(userId);

      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      return res.status(200).json({
        success: true,
        message: "user details retrieved successfully",
        user,
      });
    } catch (err) {
      next(err);
    }
  };

  // <<< Get all user details (no passwords) >>>
  getAllUsers = async (req, res, next) => {
    try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const users = await this.userRepository.getAllUsers(page, limit);

      if (!users || users.totalPages === 0) {
        throw new ApplicationError("No users found", 404);
      };

      return res.status(200).json({
        success: true,
        message: "all users details retrieved successfully",
        users,
      });
    } catch (err) {
      next(err);
    }
  };

  // <<< Update user details (no passwords) >>>
  updateUserById = async (req, res, next) => {
    try {
      // const userId = req.params.userId; // for security reason we have stopped using params approach
      const userId = req.userID; // this will allow user to update his details only not anyone's else
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

      if (req.file) {
        updateData.avatar = req.file.filename;
      }

      // If no fields provided at all
      if (Object.keys(updateData).length === 0) {
        throw new ApplicationError(
          "At least one field (name or gender or avatar) is required",
          400
        );
      }
      const updatedUser = await this.userRepository.updateUserById(
        userId,
        updateData,
      );

      if (!updatedUser) {
        throw new ApplicationError("User not found or not updated", 404);
      }
      return res.status(200).json({
        success: true,
        message: "User details updated successfully",
        updatedUser,
      });
    } catch (err) {
      next(err);
    }
  };
};
