// importing importand modules
import ApplicationError from "../../../utils/ApplicationError.js";
import LikeModel from "../like/like.model.js";
import CommentModel from "../comment/comment.model.js";

export let posts = [
  {
    id: 1,
    userId: 2,
    caption: "First post",
    imageUrl: "https://example.com/image1.jpg",
    status: "published",
    createdAt: new Date("2024-08-01T10:00:00Z"),
  },
];

export default class PostModel {
  constructor(userId, caption, imageUrl, status, createdAt = new Date()) {
    this.userId = userId;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.status = status;
    this.createdAt = createdAt;
  };

  // // Get all posts
  // static async findAll(page, limit, caption) {
  //   if (!posts || posts.length <= 0) {
  //     throw new ApplicationError("Posts Not Found", 404);
  //   }

  //   // Filter by caption if provided
  //   let filteredPosts = posts;
  //   if (caption) {
  //     filteredPosts = posts.filter((post) =>
  //       post.caption.toLowerCase().includes(caption.toLowerCase())
  //     );
  //   }

  //   if (filteredPosts) {
  //     filteredPosts = filteredPosts.filter(
  //       (post) => post.status != "draft" && post.status != "archived"
  //     );
  //   }

  //   // Pagination logic
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  //   if (!filteredPosts || filteredPosts.length <= 0) {
  //     return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };
  //   }

  //   if (startIndex >= filteredPosts.length) {
  //     return {
  //       posts: [],
  //       totalPosts: filteredPosts.length,
  //       totalPages: Math.ceil(filteredPosts.length / limit),
  //       currentPage: page,
  //     };
  //   }

  //   return {
  //     posts: paginatedPosts,
  //     totalPosts: filteredPosts.length,
  //     totalPages: Math.ceil(filteredPosts.length / limit),
  //     currentPage: page,
  //   };
  // };

  // // filtering the posts
  // static async filter(caption) {
  //   const searchWords = caption.toLowerCase().trim().split(/\s+/);

  //   return posts.filter((post) => {
  //     if (post.status === "draft" || post.status === "archived") return false;

  //     const postCaption = post.caption.toLowerCase().trim();
  //     return searchWords.every((word) => postCaption.includes(word));
  //   });
  // }

  // // Get post by ID
  // static async findById(id) {
  //   const post = posts.find(
  //     (p) => p.id === id && p.status !== "draft" && p.status !== "archived"
  //   );
  //   if (!post) {
  //     throw new ApplicationError(`Post with ID ${id} not found`, 404);
  //   }
  //   return post;
  // }

  // // create a new post

  // // find posts of logged-in users
  // static async findByUserId(userId) {
  //   const postsFound = posts.filter(
  //     (p) =>
  //       p.userId === userId && p.status !== "draft" && p.status !== "archived"
  //   );

  //   if (postsFound.length === 0) {
  //     throw new ApplicationError("No posts found for this user", 404);
  //   }
  //   return postsFound;
  // }

  // // delete specific post
  // static async delete(postId) {
  //   const postIndex = posts.findIndex((p) => p.id === postId);
  //   if (postIndex === -1) {
  //     throw new ApplicationError("Post not found", 404);
  //   }
  //   const [deletedPost] = posts.splice(postIndex, 1);
  //   return deletedPost;
  // }

  // // updating post
  // static async update(userId, id, data) {
  //   const postIndex = posts.findIndex(
  //     (p) => p.id === id && p.userId === userId
  //   );
  //   if (postIndex === -1) {
  //     throw new ApplicationError(
  //       "Post not found or you don't have permission",
  //       404
  //     );
  //   }
  //   posts[postIndex] = {
  //     ...posts[postIndex],
  //     ...data,
  //     id, // ensure ID is not accidentally overwritten
  //     userId, // ensure ownership stays intact
  //   };
  //   return posts[postIndex];
  // }

  // static async updateStatus(userId, postId, newStatus) {
  //   const postIndex = posts.findIndex(
  //     (p) => p.id === postId && p.userId === userId
  //   );
  //   if (postIndex === -1) {
  //     throw new ApplicationError("Post not found or unauthorized", 404);
  //   }

  //   const allowedTransitions = {
  //     draft: ["published"],
  //     published: ["archived"],
  //     archived: ["published"],
  //   };
  //   const currentStatus = posts[postIndex].status;

  //   // Check if newStatus is allowed for currentStatus
  //   if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
  //     throw new ApplicationError(
  //       `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
  //       400
  //     );
  //   }

  //   posts[postIndex].status = newStatus;
  //   return posts[postIndex];
  // }

  // static async getPostsSorted(by = "engagement") {
  //   if (!posts || posts.length === 0) {
  //     throw new ApplicationError("No posts found", 404);
  //   }

  //   // Compute engagement for each post
  //   const postsWithEngagement = await Promise.all(
  //     posts.map(async (post) => {
  //       const likes = await LikeModel.countByPostId(post.id);
  //       const comments = await CommentModel.countByPostId(post.id);
  //       const engagement = likes + comments;

  //       return {
  //         ...post,
  //         engagement,
  //       };
  //     })
  //   );

  //   if (by === "date") {
  //     return postsWithEngagement.sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // when two date objects are subtracted they are automatically converted to a number
  //     );
  //   }

  //   // Default: sort by engagement, then date
  //   return postsWithEngagement.sort((a, b) => {
  //     if (b.engagement === a.engagement) {
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     }
  //     return b.engagement - a.engagement;
  //   });
  // }
}
