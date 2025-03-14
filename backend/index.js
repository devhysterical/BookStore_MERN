const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
require("dotenv").config();
// mongoose
const mongoose = require("mongoose");

// routes: PXVGtS4GZwYYkb1c - lamtuankiettech2003
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
