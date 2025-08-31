import ApplicationError from "../../../utils/ApplicationError.js";
import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(req, res, next) {
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
  }
  async getAllUsers(req, res, next) {
    try {
      const users = await this.userRepository.getAllUsers();

      return res.status(200).json({
        message: "all users details retrieved successfully",
        users,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUserById(req, res, next) {
    try {
      const userId = req.params.userId;
      const { name, gender } = req.body;

      // Validate input
      if (!userId) {
        throw new ApplicationError("User ID is required", 400);
      }

      if (!name || typeof name !== "string" || !name.trim()) {
        throw new ApplicationError("Valid name is required", 400);
      }

      const allowedGenders = ["male", "female", "other"];
      if (!gender || !allowedGenders.includes(gender.toLowerCase())) {
        throw new ApplicationError(
          `Gender must be one of: ${allowedGenders.join(", ")}`,
          400
        );
      }

      const updatedUser = await this.userRepository.updateUserById(userId, {
        name: name.trim(),
        gender: gender.toLowerCase(),
      });

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
