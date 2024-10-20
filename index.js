const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const course = require("./data/course.json");
const books =require("./data/books.json");

app.use(cors());

// app.use(cors({
//   origin: ["http://localhost:5173", "https://course-react-routing-firebase.web.app"]
// }));

//server message
app.get("/", (req, res) => {
  res.send("Course Server Running");
});

app.get("/bookcategories", (req, res) => {
  res.send(books);
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
  const selectedCategory = books.filter(n => n.category === categoryParam);
  res.send(selectedCategory);
  console.log(selectedCategory);
});

app.listen(port, () => {
  console.log(`Course Server is running on ${port}`);
});
