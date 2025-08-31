//  importing required packages
import express from "express";
// importing the jwt token
import jwtAuth from "../../middlewares/jwt.middleware.js";
import upload from "../../middlewares/fileUpload.middleware.js";

//  importing post controller
import PostController from "./post.controller.js";
const PostControllerInc = new PostController();

// creating post router with express
const PostRouter = express.Router();

// // Retrieve all posts
// PostRouter.get("/all", (req, res, next) =>
//   PostControllerInc.getAllPosts(req, res, next)
// ); // Retrieve all posts

// PostRouter.get("/filter", (req, res, next) =>
//   PostControllerInc.getFilteredPosts(req, res, next)
// ); // Get posts on the basis of filter

// PostRouter.get("/", jwtAuth, (req, res, next) =>
//   PostControllerInc.getPostsByUser(req, res, next)
// ); // Retrieve post on the user credentials

// // route for sorted posts
// PostRouter.get("/sorted", jwtAuth, (req, res, next) =>
//   PostControllerInc.getSortedPosts(req, res, next)
// );

// // PostRouter.post("/", jwtAuth, upload.single("imageUrl"), (req, res, next) =>
// //   PostControllerInc.createPost(req, res, next)
// ); // create a new post

// PostRouter.get("/:id", (req, res, next) =>
//   PostControllerInc.getPostById(req, res, next)
// ); // Retrieve a specific post by id

// PostRouter.delete("/:id", jwtAuth, (req, res, next) =>
//   PostControllerInc.deletePost(req, res, next)
// ); // delete a specific post by id

// PostRouter.put("/:id", jwtAuth, (req, res, next) =>
//   PostControllerInc.updatePost(req, res, next)
// ); // Update a specific post by ID (Image upload functionality included)

// PostRouter.patch("/:id/status", jwtAuth, (req, res, next) =>
//   PostControllerInc.postStatus(req, res, next)
// ); // check a specific post status

export default PostRouter;
