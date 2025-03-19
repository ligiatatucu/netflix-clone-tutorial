const { MongoClient } = require('mongodb'); //the mongo client class is imported from mongodb package

const uri =
  'mongodb+srv://ligiatatucu21:vJUdyMUsX1qalBlp@cluster0.deznm.mongodb.net/test';

const client = new MongoClient(uri); //the client is created via connection URI

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  } finally {
    await client.close(); //ensures that database connection is finnaly closed
  }
}

run();
