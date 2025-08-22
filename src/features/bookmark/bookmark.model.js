// importing important require modules

import ApplicationError from "../../../utils/ApplicationError.js";
import { posts } from "../post/post.model.js";
import PostModel from "../post/post.model.js";

let AllBookMarks = [
  {
    id: 1,
    userId: 2,
    postId: 2,
  },
  {
    id: 2,
    userId: 2,
    postId: 3,
  },
];

export default class bookmarkModel {
  constructor(id, postId, userId) {
    this.id = id;
    this.postId = postId;
    this.userId = userId;
  }

  static async get(userId) {
    if (!AllBookMarks || AllBookMarks.length === 0) {
      throw new ApplicationError("No bookmarks found", 404);
    }
    // Get only bookmarks for this user
    const userBookmarkedPosts = AllBookMarks.filter((p) => p.userId === userId);

    if (userBookmarkedPosts.length === 0) {
      throw new ApplicationError("No bookmarks found for this user", 404);
    }

    const allPosts = posts;

    if (!allPosts || allPosts.length === 0) {
      throw new ApplicationError("No posts available", 404);
    }

    // Filter posts that are bookmarked
    const bookmarkedPosts = allPosts.filter(
      (post) =>
        post.status !== "draft" &&
        userBookmarkedPosts.some((b) => b.postId === post.id)
    );

    if (bookmarkedPosts.length === 0) {
      throw new ApplicationError("No valid bookmarked posts found", 404);
    }
    return bookmarkedPosts;
  }

  static async add(userId, postId) {
    // Check if post exists
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new ApplicationError("Post not found", 404);
    }

    if (post.status === "draft") {
      throw new ApplicationError("Cannot bookmark a draft post", 400);
    }

    // Prevent duplicate bookmarks
    const alreadyBookmarked = AllBookMarks.find(
      (b) => b.postId === postId && b.userId === userId
    );

    if (alreadyBookmarked) {
      throw new ApplicationError("Post already bookmarked", 400);
    }

    // Create new bookmark
    const newBookmark = new bookmarkModel(
      AllBookMarks.length + 1,
      postId,
      userId
    );

    AllBookMarks.push(newBookmark);

    return newBookmark;
  }

  static async delete(userId, postId) {
    const bookmarkIndex = AllBookMarks.findIndex(
      (b) => b.userId === userId && b.postId === postId
    );

    if (bookmarkIndex === -1) {
      throw new ApplicationError("post not in Bookmark", 404);
    }

    const [removedBookmark] = AllBookMarks.splice(bookmarkIndex, 1);

    if (!removedBookmark) {
      throw new ApplicationError(
        "Something went wrong while removing bookmark",
        500
      );
    }

    return removedBookmark;
  }
}
