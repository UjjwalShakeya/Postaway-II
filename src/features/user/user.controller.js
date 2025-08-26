// importing important modules
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApplicationError from "../../../utils/ApplicationError.js";
const jwtSecret = process.env.JWT_SECRET;

import UserRepository from "./user.respository.js";

export default class UserController {
  constructor(){
    this.userRepository = new UserRepository();
  };

  async SignUp(req, res, next) {
    try {
      const { name, email, password } = req.body;

      // Double-check input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser  = await this.userRepository.findByEmail(email);

      if (existingUser ) {
        throw new ApplicationError("User already exists with this email", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, hashedPassword);

      const result = await this.userRepository.signUp(user);
      
      // Optional: Auto-login after signup
      const token = jwt.sign(
        { userID: result._id, email: result.email},
        jwtSecret,
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "User created successfully",
        user: { id: result._id, name: result.name, email: result.email },
        token,
        expiresIn: "1h",
      });
    } catch (err) {
      next(err);
    }
  }

  async SignIn(req, res, next) {
    try {
      const { email, password } = req.body;

      // checking email and password if any of them is missing then throw error
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      
      const user =  await this.userRepository.findByEmail(email);

      if (!user) {
      // Don’t reveal whether email exists
      return res.status(401).json({ message: "Invalid credentials" });
    }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
      };

      const token = jwt.sign(
        { userID: user._id, email: user.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        expiresIn: "1h",
      });

    } catch (err) {
      next(err);
    }
  } 

    // Simple Reset (with old password verification) later when using email services and th db we can easily reset password without needing the old one 
    async ResetPassword(req, res, next) {
    try {
      const { email, oldPassword, newPassword } = req.body;

      // validate inputs
      if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // check old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      // hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // update in model
      await UserModel.updatePassword(email, hashedPassword);

      return res.status(200).json({ message: "Password updated successfully" });

    } catch (err) {
      next(err);
    }
  }

}
