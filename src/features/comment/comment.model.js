
// let comments = [
//   { id: 1, userId: 1, postId: 1, comment: "First comment on post 1" },
//   { id: 2, userId: 2, postId: 1, comment: "Second comment on post 1" },
//   { id: 3, userId: 3, postId: 1, comment: "Great photo!" },
//   { id: 4, userId: 4, postId: 1, comment: "Nice shot!" },
//   { id: 5, userId: 5, postId: 1, comment: "Looks amazing!" },
//   { id: 6, userId: 6, postId: 2, comment: "Great capture" },
//   { id: 7, userId: 7, postId: 2, comment: "Love this vibe" },
//   { id: 8, userId: 8, postId: 2, comment: "Where was this taken?" },
//   { id: 9, userId: 9, postId: 2, comment: "Beautiful scenery" },
//   { id: 10, userId: 10, postId: 2, comment: "Awesome colors" },
//   { id: 11, userId: 3, postId: 2, comment: "I want to go there!" },
//   { id: 12, userId: 5, postId: 2, comment: "Perfect timing" },
//   { id: 13, userId: 4, postId: 2, comment: "Cool shot" },
//   { id: 14, userId: 9, postId: 1, comment: "Love this place" },
//   { id: 15, userId: 2, postId: 1, comment: "This is stunning" },
//   { id: 16, userId: 10, postId: 1, comment: "Absolutely gorgeous" },
//   { id: 17, userId: 7, postId: 1, comment: "Wow, breathtaking" },
//   { id: 18, userId: 6, postId: 1, comment: "So peaceful" },
//   { id: 19, userId: 1, postId: 1, comment: "Love the mood" },
//   { id: 20, userId: 8, postId: 1, comment: "Incredible shot" },
// ];

export default class CommentModel {
  constructor( userId, postId, comment) {
    this.userId = userId;
    this.postId = postId;
    this.comment = comment;
  }
  
  // static async findCommentByPost(postId, page, limit) {
  //   const isPostFoud = PostModel.findById(postId);

  //   if (!isPostFoud) {
  //     throw new ApplicationError("Post not found", 404);
  //   }

  //   const allCommentsByPost = comments.filter((c) => c.postId === postId);

  //   if (allCommentsByPost.length === 0) {
  //     throw new ApplicationError("No comments found for this post", 404);
  //   }

  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   const paginatedComments = allCommentsByPost.slice(startIndex, endIndex);

  //   return {
  //     comments: paginatedComments,
  //     totalComments: allCommentsByPost.length,
  //     totalPages: Math.ceil(allCommentsByPost.length / limit),
  //     currentPage: page,
  //   };
  // }

  // static async add(userId, postId, comment) {
  //   const newComment = new CommentModel(
  //     comments.length + 1,
  //     userId,
  //     postId,
  //     comment
  //   );
  //   comments.push(newComment);
  //   return newComment;
  // }
  // static async remove(id, userId) {
  //   const commentIndex = comments.findIndex(
  //     (c) => c.id === id && c.userId === userId
  //   );
  //   if (commentIndex == -1) {
  //     throw new ApplicationError("comment not found", 404);
  //   }
  //   const [deletedComment] = comments.splice(commentIndex, 1);

  //   if (!deletedComment) {
  //     throw new ApplicationError("Something went wrong deleting comment", 500);
  //   }

  //   return deletedComment;
  // }

  // static async update(id, comment, userId) {
  //   const commentIndex = comments.findIndex(
  //     (c) => c.userId === userId && c.id === id
  //   );

  //   if (commentIndex === -1) {
  //     throw new ApplicationError("Comment not found or not authorized", 404);
  //   }
  //   const oldComment = comments[commentIndex].comment;
  //   if (oldComment === comment.trim()) {
  //     throw new ApplicationError(
  //       "New comment must be different from the old one",
  //       400
  //     );
  //   }

  //   comments[commentIndex].comment = comment.trim();
  //   return comments[commentIndex];
  // }

  // static async countByPostId(postId) {
  //   return comments.filter((comment) => comment.postId === postId).length;
  // }
}
