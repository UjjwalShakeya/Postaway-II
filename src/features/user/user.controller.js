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
}
