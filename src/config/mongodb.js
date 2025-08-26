// step 1. importing mongo client
import { MongoClient } from "mongodb";

// step 2. assigning url to variable called url

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
let client;

// step 3. creating function to create
export const connectToMongoDB = async () => {
  if (!url) throw new Error("DB_URL not found in env");

  try {
    client = await MongoClient.connect(url);
    console.log("Mongodb is connected");
  } catch (err) {
    console.log(err);
  }
};

// step 4. exporting db
export const getDB = () => {
  if (!client) throw new Error("MongoDB not connected yet!");
  return client.db(dbName);
};
