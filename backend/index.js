const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    // methods: "GET,POST,PUT,DELETE",
    // allowedHeaders: "Content-Type,Authorization",
  })
);

// mongoose
const mongoose = require("mongoose");

// routes
const bookRoutes = require("./src/books/book.route");
app.use("/api/books", bookRoutes);
async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use("/", (req, res) => {
    res.send("BookStore API is running...");
  });
}
main()
  .then(() => console.log("Mongodb connect successfully!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`BookStore API listening on port ${port}`);
});
