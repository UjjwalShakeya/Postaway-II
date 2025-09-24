// Post routes

// Import required packages :-

// Third-party packages
import express from "express";

// Application modules :-
import jwtAuth from "../../middlewares/jwt.middleware.js";
import PostController from "./post.controller.js";
import upload from "../../middlewares/fileUpload.middleware.js";


// Initialize router and controller :-
const PostRouter = express.Router();
const postController = new PostController();

// Routes :-

// Create a new post
// Purpose: Allow authenticated user to create a post with optional image
// Middleware: jwtAuth → ensures user is authenticated
// upload.single("imageUrl") → handles single image upload
PostRouter.post("/", jwtAuth, upload.single("imageUrl"), postController.createPost
);

// Retrieve all posts
// Purpose: Fetch all posts from database
PostRouter.get("/all", postController.getAllPosts);


// Get post by ID
// Purpose: Fetch a specific post by its ID
PostRouter.get("/:id", postController.getPostById);

// Get posts by logged-in user
// Purpose: Fetch posts created by the authenticated user
// Middleware: jwtAuth → ensures user is authenticated
PostRouter.get("/user/:userId", jwtAuth, postController.getPostsByUserCred
);

// Delete post by ID
// Purpose: Delete a specific post by its ID
// Middleware: jwtAuth → ensures user is authenticated
PostRouter.delete("/:postId", jwtAuth, postController.deletePost);

// Update post by ID
// Purpose: Update a specific post by its ID
// Middleware: jwtAuth → ensures user is authenticated
// upload.none() → ensures only text fields are updated
PostRouter.put("/:postId", jwtAuth,postController.updatePost);

// check a specific post status
// PostRouter.patch("/:id/status", jwtAuth, (req, res, next) =>
//   postController.postStatus(req, res, next)
// ); 

// Get posts on the basis of filter
// PostRouter.get("/filter", (req, res, next) =>
//   postController.getFilteredPosts(req, res, next)
// ); 


// // route for sorted posts
// PostRouter.get("/sorted", jwtAuth, (req, res, next) =>
//   postController.getSortedPosts(req, res, next)
// );

export default PostRouter;
