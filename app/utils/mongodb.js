import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI 
const dbName = process.env.DB_NAME
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await client.connect();
  console.log("Connected to MongoDB!");

  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;

  return db;
}
