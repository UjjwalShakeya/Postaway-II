// Friendship Model
export default class FriendshipModel {
  constructor(userId, friendId, status, createdAt, updatedAt) {
    this.userId = userId;
    this.friendId = friendId;
    this.status = status; // "pending", "accepted", "rejected",
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
};
