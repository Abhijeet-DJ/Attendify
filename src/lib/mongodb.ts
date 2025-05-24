// src/lib/mongodb.ts
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

interface ConnectToDatabaseResult {
  client: MongoClient;
  db: Db;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}


export async function connectToDatabase(): Promise<ConnectToDatabaseResult> {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri!, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri!, options);
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;
  const dbName = new URL(uri!).pathname.substring(1) || 'Attendify'; // Extract DB name or default
  const db = connectedClient.db(dbName);
  
  return { client: connectedClient, db };
}
