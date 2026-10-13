import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petrol-skill";

const globalForMongo = globalThis as unknown as { mongo?: Promise<MongoClient> };

function clientPromise() {
  if (!globalForMongo.mongo) {
    const client = new MongoClient(uri);
    globalForMongo.mongo = client.connect();
  }
  return globalForMongo.mongo;
}

export async function database(): Promise<Db> {
  const client = await clientPromise();
  return client.db();
}
