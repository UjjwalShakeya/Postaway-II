// importing required module
// import ApplicationError from "../../../utils/ApplicationError.js";

// let likes = [
//   { id: 1, userId: 1, postId: 1 },
//   { id: 2, userId: 2, postId: 1 },
//   { id: 3, userId: 3, postId: 2 },
//   { id: 4, userId: 5, postId: 2 },
//   { id: 5, userId: 70, postId: 2 },
// ];

export default class LikeModel {
  constructor(userId, postId) {
    this.userId = userId;
    this.postId = postId;
  }

  // get all likes
  // static async getAll(postId) {
  //   const allLikes = likes.filter((l) => l.postId === postId);
  //   if (allLikes.length === 0) {
  //     throw new ApplicationError("No likes found for this post", 404);
  //   }
  //   return allLikes;
  // }

  // // like specific post post
  // static async add(userId, postId) {
  //   // prevent duplicate likes
  //   const existingLike = likes.find(
  //     (l) => l.userId === userId && l.postId === postId
  //   );
  //   if (existingLike) {
  //     throw new ApplicationError("User already liked this post", 400);
  //   }
  //   const newLike = new LikeModel(likes.length + 1, userId, postId);
  //   likes.push(newLike);

  //   return newLike;
  // }

  // static async delete(userId, postId) {
  //   const likeIndex = likes.findIndex(
  //     (l) => l.userId === userId && l.postId === postId
  //   );
  //   if (likeIndex === -1) {
  //     throw new ApplicationError("Like not found", 404);
  //   }
  //   const deletedLike = likes.splice(likeIndex, 1)[0];
  //   return deletedLike;
  // }

  // // to calculate engagement for posts
  // static async countByPostId(postId) {
  //   return likes.filter((like) => like.postId === postId).length;
  // }
}
