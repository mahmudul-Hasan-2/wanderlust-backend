const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to wanderlust server");
});

const JWKS = createRemoteJWKSet(new URL("http://localhost:3000/api/auth/jwks"));

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log(token);

  try {
    const { payload } = await jwtVerify(token, JWKS);

    next();
    console.log(payload);
  } catch (error) {
    console.log(error);
  }
};

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    const db = client.db("wanderlust");
    const destinations = db.collection("destinations");
    const bookings = db.collection("bookings");

    app.post("/bookings", async (req, res) => {
      const newData = req.body;

      const result = await bookings.insertOne(newData);
      res.json(result);
    });

    app.get("/bookings/:userid", async (req, res) => {
      const { userid } = req.params;

      const query = {
        userId: userid,
      };

      const allBookingsData = await bookings.find(query).toArray();
      res.json(allBookingsData);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const { id } = req.params;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await bookings.deleteOne(query);
      res.json(result);
    });

    app.get("/destinations", async (req, res) => {
      const allDestinations = await destinations.find().toArray();
      res.json(allDestinations);
    });
    app.get("/destinations/:id", verifyToken, async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await destinations.findOne(query);

      res.json(result);
    });

    app.post("/destinations", async (req, res) => {
      const destination = req.body;

      const data = await destinations.insertOne(destination);
      console.log(data);
      res.send(data);
    });
    app.delete("/destinations/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await destinations.deleteOne(query);

      res.json(result);
    });
    app.patch("/destinations/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      console.log(updatedData);

      const result = await destinations.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updatedData } },
      );

      res.json(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`Port is running in ${port}`);
});
