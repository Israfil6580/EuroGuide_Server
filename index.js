const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbraxw8.mongodb.net/euroguide`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// middleware
// Middleware Connections
const corsConfig = {
  origin: ["https://magnificent-bavarois-f6e8db.netlify.app/"],
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());

async function run() {
  try {
    // Connect the client to the server  (optional starting in v4.7)
    // await client.connect();

    app.get("/countries", async (req, res) => {
      try {
        const db = client.db("euroguide");
        const collection = db.collection("countries");
        const documents = await collection.find().toArray();
        // Send the retrieved documents as JSON response
        res.json(documents);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    });

    app.get("/review", async (req, res) => {
      try {
        const db = client.db("euroguide");
        const collection = db.collection("reviews");
        const documents = await collection.find().toArray();
        // Send the retrieved documents as JSON response
        res.json(documents);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    });

    app.get("/added_spot", async (req, res) => {
      try {
        // Select the database
        const db = client.db("euroguide");

        // Select the collection
        const collection = db.collection("tourist_spots");
        // Find documents in the collection
        const documents = await collection.find().toArray();
        // Send the retrieved documents as JSON response
        res.json(documents);
      } catch (error) {
        console.error("Error fetching added spots:", error);
      }
    });

    app.post("/added_spot", async (req, res) => {
      const spot = req.body;
      try {
        // Select the database
        const db = client.db("euroguide");
        const collection = db.collection("tourist_spots");
        // Insert the received data into the collection
        const result = await collection.insertOne(spot);
        res.send(result);
      } catch (error) {
        console.error("Error adding spot:", error);
      }
    });

    app.delete("/added_spot/:id", async (req, res) => {
      const db = client.db("euroguide");
      const collection = db.collection("tourist_spots");
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    });
    app.get("/added_spot/:id", async (req, res) => {
      const db = client.db("euroguide");
      const collection = db.collection("tourist_spots");
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.findOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on port:", port);
});
