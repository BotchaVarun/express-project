// /api/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const uri = "mongodb+srv://varun:1234@cluster0.yllpes0.mongodb.net/meghana?retryWrites=true&w=majority&appName=Cluster0";
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set.');
}
const client = new MongoClient(uri);

app.get('/api/hello', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('your-db-name'); // Change to your database name
    const data = await db.collection('sample').find({}).toArray();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Export the app as a Vercel serverless function
module.exports = app;
module.exports.handler = (req, res) => app(req, res);
