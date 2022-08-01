import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

/* Creating a new instance of MongoMemoryServer and connecting to it. */
beforeAll(async () => {
  const mongo = new MongoMemoryServer();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

/* Deleting all the data in the database before each test. */
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
