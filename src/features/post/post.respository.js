import ApplicationError from "../../../utils/ApplicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class PostRepository {
  constructor() {
    this.collection = "posts";
  }

  async createPost(newPost) {
    try {
      // getting db access
      const db = getDB();

      // getting collection access
      const collection = db.collection(this.collection);

      await collection.insertOne(newPost);

      return newPost;
      
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
