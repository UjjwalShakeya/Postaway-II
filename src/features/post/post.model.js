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
  {
    id: 2,
    userId: 2,
    caption: "Second post",
    imageUrl: "https://example.com/image2.jpg",
    status: "published",
    createdAt: new Date("2024-07-28T09:15:00Z"),
  },
  {
    id: 3,
    userId: 2,
    caption: "Third post",
    imageUrl: "https://example.com/image3.jpg",
    status: "published",
    createdAt: new Date("2024-07-30T14:45:00Z"),
  },
  {
    id: 4,
    userId: 6,
    caption: "Morning vibes",
    imageUrl: "https://example.com/image4.jpg",
    status: "published",
    createdAt: new Date("2024-08-03T08:30:00Z"),
  },
  {
    id: 5,
    userId: 4,
    caption: "Beach day",
    imageUrl: "https://example.com/image5.jpg",
    status: "draft",
    createdAt: new Date("2024-07-25T12:00:00Z"),
  },
  {
    id: 6,
    userId: 5,
    caption: "Coffee time",
    imageUrl: "https://example.com/image6.jpg",
    status: "published",
    createdAt: new Date("2024-08-05T07:20:00Z"),
  },
  {
    id: 7,
    userId: 2,
    caption: "City lights",
    imageUrl: "https://example.com/image7.jpg",
    status: "published",
    createdAt: new Date("2024-08-06T19:45:00Z"),
  },
  {
    id: 8,
    userId: 7,
    caption: "Nature walk",
    imageUrl: "https://example.com/image8.jpg",
    status: "draft",
    createdAt: new Date("2024-07-29T16:10:00Z"),
  },
  {
    id: 9,
    userId: 1,
    caption: "Workout session",
    imageUrl: "https://example.com/image9.jpg",
    status: "archived",
    createdAt: new Date("2024-08-07T05:50:00Z"),
  },
  {
    id: 10,
    userId: 8,
    caption: "Dinner with friends",
    imageUrl: "https://example.com/image10.jpg",
    status: "published",
    createdAt: new Date("2024-08-08T21:15:00Z"),
  },
  {
    id: 11,
    userId: 3,
    caption: "Art gallery visit",
    imageUrl: "https://example.com/image11.jpg",
    status: "draft",
    createdAt: new Date("2024-08-09T14:25:00Z"),
  },
  {
    id: 12,
    userId: 6,
    caption: "Sunset capture",
    imageUrl: "https://example.com/image12.jpg",
    status: "published",
    createdAt: new Date("2024-08-10T18:40:00Z"),
  },
  {
    id: 13,
    userId: 9,
    caption: "Book reading",
    imageUrl: "https://example.com/image13.jpg",
    status: "published",
    createdAt: new Date("2024-08-11T09:05:00Z"),
  },
  {
    id: 14,
    userId: 5,
    caption: "Mountain hiking",
    imageUrl: "https://example.com/image14.jpg",
    status: "draft",
    createdAt: new Date("2024-08-12T11:50:00Z"),
  },
  {
    id: 15,
    userId: 4,
    caption: "Rainy day",
    imageUrl: "https://example.com/image15.jpg",
    status: "published",
    createdAt: new Date("2024-08-13T17:30:00Z"),
  },
  {
    id: 16,
    userId: 7,
    caption: "Gaming night",
    imageUrl: "https://example.com/image16.jpg",
    status: "published",
    createdAt: new Date("2024-08-14T20:45:00Z"),
  },
  {
    id: 17,
    userId: 8,
    caption: "Family picnic",
    imageUrl: "https://example.com/image17.jpg",
    status: "published",
    createdAt: new Date("2024-08-15T13:10:00Z"),
  },
  {
    id: 18,
    userId: 9,
    caption: "Street photography",
    imageUrl: "https://example.com/image18.jpg",
    status: "draft",
    createdAt: new Date("2024-08-16T15:55:00Z"),
  },
  {
    id: 19,
    userId: 10,
    caption: "Cooking experiment",
    imageUrl: "https://example.com/image19.jpg",
    status: "published",
    createdAt: new Date("2024-08-17T06:25:00Z"),
  },
  {
    id: 20,
    userId: 2,
    caption: "Throwback vacation",
    imageUrl: "https://example.com/image20.jpg",
    status: "published",
    createdAt: new Date("2024-08-18T10:45:00Z"),
  },
];

export default class PostModel {
  constructor(id, userId, caption, imageUrl, status) {
    this.id = id;
    this.userId = userId;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.status = status;
  }

  // Get all posts
  static async findAll(page, limit, caption) {
    if (!posts || posts.length <= 0) {
      throw new ApplicationError("Posts Not Found", 404);
    }

    // Filter by caption if provided
    let filteredPosts = posts;
    if (caption) {
      filteredPosts = posts.filter((post) =>
        post.caption.toLowerCase().includes(caption.toLowerCase())
      );
    }

    if (filteredPosts) {
      filteredPosts = filteredPosts.filter(
        (post) => post.status != "draft" && post.status != "archived"
      );
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    if (!filteredPosts || filteredPosts.length <= 0) {
      return { posts: [], totalPosts: 0, totalPages: 0, currentPage: page };
    }

    if (startIndex >= filteredPosts.length) {
      return {
        posts: [],
        totalPosts: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
        currentPage: page,
      };
    }

    return {
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
      currentPage: page,
    };
  }

  // filtering the posts
  static async filter(caption) {
    const searchWords = caption.toLowerCase().trim().split(/\s+/);

    return posts.filter((post) => {
      if (post.status === "draft" || post.status === "archived") return false;

      const postCaption = post.caption.toLowerCase().trim();
      return searchWords.every((word) => postCaption.includes(word));
    });
  }

  // Get post by ID
  static async findById(id) {
    const post = posts.find(
      (p) => p.id === id && p.status !== "draft" && p.status !== "archived"
    );
    if (!post) {
      throw new ApplicationError(`Post with ID ${id} not found`, 404);
    }
    return post;
  }

  // create a new post
  static async add(userID, caption, image, status) {
    const Post = new PostModel(
      posts.length + 1,
      parseInt(userID),
      caption,
      image,
      status
    );
    posts.push(Post);
    return Post;
  }

  // find posts of logged-in users
  static async findByUserId(userId) {
    const postsFound = posts.filter(
      (p) =>
        p.userId === userId && p.status !== "draft" && p.status !== "archived"
    );

    if (postsFound.length === 0) {
      throw new ApplicationError("No posts found for this user", 404);
    }
    return postsFound;
  }

  // delete specific post
  static async delete(postId) {
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) {
      throw new ApplicationError("Post not found", 404);
    }
    const [deletedPost] = posts.splice(postIndex, 1);
    return deletedPost;
  }

  // updating post
  static async update(userId, id, data) {
    const postIndex = posts.findIndex(
      (p) => p.id === id && p.userId === userId
    );
    if (postIndex === -1) {
      throw new ApplicationError("Post not found or you don't have permission", 404);
    }
    posts[postIndex] = {
      ...posts[postIndex],
      ...data,
      id, // ensure ID is not accidentally overwritten
      userId, // ensure ownership stays intact
    };
    return posts[postIndex];
  }

  static async updateStatus(userId, postId, newStatus) {
    const postIndex = posts.findIndex(
      (p) => p.id === postId && p.userId === userId
    );
    if (postIndex === -1) {
      throw new ApplicationError("Post not found or unauthorized", 404);
    }

    const allowedTransitions = {
      draft: ["published"],
      published: ["archived"],
      archived: ["published"],
    };
    const currentStatus = posts[postIndex].status;

    // Check if newStatus is allowed for currentStatus
    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new ApplicationError(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
        400
      );
    }

    posts[postIndex].status = newStatus;
    return posts[postIndex];
  }

  static async getPostsSorted(by = "engagement") {
    if (!posts || posts.length === 0) {
      throw new ApplicationError("No posts found", 404);
    }

    // Compute engagement for each post
    const postsWithEngagement = await Promise.all(
    posts.map(async (post) => {
      const likes = await LikeModel.countByPostId(post.id);
      const comments = await CommentModel.countByPostId(post.id);
      const engagement = likes + comments;

      return {
        ...post,
        engagement,
      };
    })
  );
    
    if (by === "date") {
      return postsWithEngagement.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // when two date objects are subtracted they are automatically converted to a number
      );
    }

    // Default: sort by engagement, then date
    return postsWithEngagement.sort((a, b) => {
      if (b.engagement === a.engagement) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.engagement - a.engagement;
    });
  }
}
