// Import required packages :-
// Third-party packages
import express from "express";

// Application modules :-
import jwtAuth from "../../middlewares/jwt.middleware.js";
import PostController from "./post.controller.js";

import upload from "../../middlewares/fileUpload.middleware.js";

// Initialize router and controller :-
const PostRouter = express.Router();
const PostControllerInc = new PostController();

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

// Update a specific post by ID (Image upload functionality included)
PostRouter.put("/:postId", jwtAuth, (req, res, next) =>
  PostControllerInc.updatePost(req, res, next)
); 



// check a specific post status
// PostRouter.patch("/:id/status", jwtAuth, (req, res, next) =>
//   PostControllerInc.postStatus(req, res, next)
// ); 

// Get posts on the basis of filter
// PostRouter.get("/filter", (req, res, next) =>
//   PostControllerInc.getFilteredPosts(req, res, next)
// ); 


// // route for sorted posts
// PostRouter.get("/sorted", jwtAuth, (req, res, next) =>
//   PostControllerInc.getSortedPosts(req, res, next)
// );


export default PostRouter;
