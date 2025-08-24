// step 1. importing mongo client
import { MongoClient } from "mongodb";


// step 2. assigning url to variable called url

const url = process.env.DB_URL;

// step 3. creating function to create 
const connectToMongoDB =  () =>{
     MongoClient.connect(url).then((client)=>{
        console.log("Mongodb is connected")
    }).catch((err)=>{
        console.log(err);
    });
}

// step 4. exporting function
export default connectToMongoDB;

