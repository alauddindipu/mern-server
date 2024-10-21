const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const app = express();
const port = process.env.PORT || 5000;

const course = require("./data/course.json");

app.use(cors());
app.use(express.json());

// app.use(cors({
//   origin: ["http://localhost:5173", "https://course-react-routing-firebase.web.app"]
// }));

const uri= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.sahfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    await client.connect();

    const userCollection = client.db("MernDB").collection("users");

    // Fetch all users
    app.get("/users", async (req, res) => {
      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // Fetch a user by Firebase uid
    app.get("/user/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Add a new user to the collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Update user by id
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      console.log({ user });
      const updatedUser = {
        $set: {
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
          address: user.address,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    // Delete user by id
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // Messages Section
    // Create message
    app.post("/messages", async (req, res) => {
      const { title, message, email } = req.body;
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");

      const newMessage = {
        title,
        message,
        email,
        createdAt: new Date(),
      };

      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
    });
    // Get all messages
    app.get("/messages", async (req, res) => {
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");
      const messages = await messageCollection.find().toArray();
      res.send(messages);
    });
    // Get message by id
    app.get("/messages/:id", async (req, res) => {
      const id = req.params.id;
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");
      const message = await messageCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(message);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
    // await client.close(); // Commented out for persistent connection
  }
}
run().catch(console.error);

//server message==============================================
app.get("/", (req, res) => {
  res.send("Server Running");
});
//=======================================================
app.get("/bookcategories", (req, res) => {
  res.send(course);
});


app.get("/course", (req, res) => {
  res.send(course);
});

app.get("/course/:id", (req, res) => {
  id = req.params.id;
  // console.log(id);
  const selectedProducts = course.find(n => n._id === id);
  res.send(selectedProducts);
});

app.get("/bookcategories/:category", (req, res) => {
  categoryParam = req.params.category;
  // console.log(id);
  const selectedCategory = course.filter(n => n.category === categoryParam);
  res.send(selectedCategory);
  console.log(selectedCategory);
});

//==================================
app.listen(port, () => {
  console.log(`Course Server is running on ${port}`);
});
