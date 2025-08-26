// importing enviroment variables
import "./env.js";

// Imported important Packages
import express from "express";

// Imported route files
import userRouter from "./src/features/user/user.routes.js";
import PostRouter from "./src/features/post/post.routes.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import LikeRouter from "./src/features/like/like.routes.js";
import bookmarkRouter from "./src/features/bookmark/bookmark.routes.js";

// importing middlewares
import {loggerMiddleware, errorLoggerMiddleware} from "./src/middlewares/logger.middleware.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";


// importing mongodb 
import {connectToMongoDB} from "./src/config/mongodb.js";

// creating an instance of express
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing form data

// using logger middlware for every request
app.use(loggerMiddleware);
// error logger for all requests  
app.use(errorLoggerMiddleware);

// User Router On Default 
app.use("/api/user", userRouter);

// post Router On post 
app.use("/api/posts", PostRouter);

// comment Router On post 
app.use("/api/comments",commentRouter);

// // like Router On post 
app.use("/api/likes", LikeRouter);

app.use("/api/bookmarks", bookmarkRouter);

// calling error Handler
app.use(errorHandler);

// setup server 
const PORT = 3000;
app.listen(PORT, async () => {
  console.log("server is live on 3000");
  connectToMongoDB();
});

