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

// Retrieve all posts
PostRouter.get("/all", (req, res, next) =>
  PostControllerInc.getAllPosts(req, res, next)
); 

// Retrieve a specific post by id
PostRouter.get("/:id", (req, res, next) =>
  PostControllerInc.getPostById(req, res, next)
); 

// create a new post
PostRouter.post("/", jwtAuth, upload.single("imageUrl"), (req, res, next) =>
  PostControllerInc.createPost(req, res, next)
); 

// Retrieve post on the user credentials
PostRouter.get("/user/:userId", jwtAuth, (req, res, next) =>
  PostControllerInc.getPostsByUserCred(req, res, next)
); 

// delete a specific post by id
PostRouter.delete("/:postId", jwtAuth, (req, res, next) =>
  PostControllerInc.deletePost(req, res, next)
); 

PostRouter.put("/:postId", jwtAuth, (req, res, next) =>
  PostControllerInc.updatePost(req, res, next)
); // Update a specific post by ID (Image upload functionality included)


// Get posts on the basis of filter
// PostRouter.get("/filter", (req, res, next) =>
//   PostControllerInc.getFilteredPosts(req, res, next)
// ); 


// // route for sorted posts
// PostRouter.get("/sorted", jwtAuth, (req, res, next) =>
//   PostControllerInc.getSortedPosts(req, res, next)
// );


// PostRouter.patch("/:id/status", jwtAuth, (req, res, next) =>
//   PostControllerInc.postStatus(req, res, next)
// ); // check a specific post status

export default PostRouter;
