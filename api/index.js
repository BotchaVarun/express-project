// /api/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const uri = process.env.MONGODB_URI;
let client;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('express'); // change this
}

app.get('/api/hello', async (req, res) => {
  const db = await connectToMongo();
  const data = await db.collection('test').find().toArray();
  res.json(data);
});

module.exports = app;
