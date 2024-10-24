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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.sahfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const categoryCollection = client.db("MernDB").collection("category");
    const productCollection = client.db("MernDB").collection("product");
    const buyCollection = client.db("MernDB").collection("buy");


    app.post("/products", async (req, res) => {
      const products = req.body;
      //console.log(products);
      const result = await productCollection.insertOne(products);
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    // to edit values get in input form
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      //console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      //console.log(result);
      res.send(result);
    });
    //to update
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      //console.log(id, product);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedProduct = {
        $set: {
          productName: product.productName,
          description: product.description,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        option
      );
      res.send(result);
    });
    //==========another way Total products==============using this===========
    app.get("/totalProducts", async (req, res) => {
      const query = productCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    //============show All products in table=================
    app.get("/allproducts", async (req, res) => {
      const query = productCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    //============user-wise Buy Info===============//////////////////////////////////////
app.get("/buySummary/:userId", async (req, res) => {
  const userId = req.params.userId;
  const query = { userId: userId };
  const result = await buyCollection.find(query).toArray();
  res.send(result);
   console.log(result);
});
    //============Category-wise Products===============
    app.get("/bookCategoryWiseDetails/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await productCollection.find(query).toArray();
      res.send(result);
      // console.log(result);
    });



    app.get("/product/:id", async (req, res) => {
      const _id = req.params.id;
      //const query = { _id: _id }
      const query = { _id: new ObjectId(_id) };
      const result = await productCollection.findOne(query).toArray();
      res.send(result);
      console.log(_id);
      console.log(result);
    });

    //==========show in drop down list===============
    app.get("/categories", async (req, res) => {
      const query = categoryCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    //============add category=================
    app.post("/category", async (req, res) => {
      const categories = req.body;
      //console.log(categories);
      const result = await categoryCollection.insertOne(categories);
      res.send(result);
    });

    //============show All category in table=================
    app.get("/category", async (req, res) => {
      const query = categoryCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

//==========Buy Summary============
    app.get("/buySummary", async (req, res) => {
      const query = buyCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const query = productCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

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
//save buyer information
app.post("/buy", async (req, res) => {
  const buyer = req.body;
  const result = await buyCollection.insertOne(buyer);
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
      //console.log({ user });
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
//===================USED JSON====================================

// app.get("/course", (req, res) => {
//   res.send(course);
// });

app.get("/course/:id", (req, res) => {
  id = req.params.id;
  // console.log(id);
  const selectedProducts = course.find(n => n._id === id);
  res.send(selectedProducts);
});

app.get("/bookcategories", (req, res) => {
  res.send(course);
});

//book categories by category name
app.get("/bookcategories/:category", (req, res) => {
  categoryParam = req.params.category;
  const selectedCategory = course.filter(n => n.category === categoryParam);
  res.send(selectedCategory);
});

//==================================
app.listen(port, () => {
  console.log(`Course Server is running on ${port}`);
});
