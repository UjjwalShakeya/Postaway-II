// importing important modules
import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../../utils/ApplicationError.js";

export default class CommentRepository {
  constructor() {
    this.collection = "comments";
  };
  
  async createComment(data) {
    try {
        // 1. getting db  
        const db = getDB();
        // 2. getting collection
        const collection = db.collection(this.collection);
        
        // 3. creating comment
        const newComment =  await collection.insertOne(data);
        if (!newComment){
          throw new ApplicationError("error adding comment to post", 400);
        };

        return data;
       
    } catch (err) {
        throw new ApplicationError("Error creating a post: " + err.message, 500);
        
    }
  }
}
