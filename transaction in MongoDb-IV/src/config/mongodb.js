
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.DB_URL;
console.log("URL: "+url);

 let client;
// export const connectToMongoDB = ()=>{
//     MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
//         .then(clientInstance=>{
//             client=clientInstance
//             console.log("Mongodb is connected");
//             createCounter(client.db("ecomdb"));
//             createIndexes(client.db("ecomdb"));
//         })
//         .catch(err=>{
//             console.log(err);
//         })
// }

export async function connectDatabase() {
     client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        createCounter(client.db("ecomdb"));
        createIndexes(client.db("ecomdb"));
        return client.db("ecomdb");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return null;
    }
}


export const getClient = ()=>{
    return client;
}

export const getDB = async ()=>{
     return await connectDatabase();
     // client.db("ecomdb");
    
}

const createCounter = async(db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }
}

const createIndexes = async(db)=>{
    try{
        await db.collection("products").createIndex({price:1});
        await db.collection("products").createIndex({name:1, category:-1});
        await db.collection("products").createIndex({desc:"text"});
    }catch(err){
        console.log(err);
    }
    console.log("Indexes are created");
}
