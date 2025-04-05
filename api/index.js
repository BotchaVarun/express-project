// /api/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path=require('path');
const app = express();
app.use(bodyParser.json());

const uri = "mongodb+srv://varun:1234@cluster0.yllpes0.mongodb.net/meghana?retryWrites=true&w=majority&appName=Cluster0";

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set.');
}
const client = new MongoClient(uri);

// 📌 GET: Sample test route
app.get('/api/hello', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('meghana'); // Replace with your real DB
    const data = await db.collection('sample').find({}).toArray();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ POST: Register a user
app.post('/api/add', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await client.connect();
    const db = client.db('meghana');
    const users = db.collection('users');

    // Check for existing email
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // Insert new user
    await users.insertOne({ fullname, email, password });
    res.status(201).json({ success: true, message: "User registered" });

  } catch (error) {
    console.error("POST /api/add error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
app.get('/users/:fullname',bodyparser.json(),async(req,res)=>{
    try{
    await client.connect();
    const db = client.db('meghana');
    const users = db.collection('users');
    const user=await users.find({email:req.params.fullname});
      if(!users)
      {
          return res.status(404).json({message:"user not found"});
      }
      res.status(200).json(users);
    }
    catch(err)
    {
      res.status(500).json({message:"error"});
    }
  })
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
// 🔁 Vercel export
module.exports = app;
module.exports.handler = (req, res) => app(req, res);
