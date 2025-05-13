const express = require("express");
const router = express.Router();
const {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
} = require("./book.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const Book = require("./book.model"); // Your Book model

// Logic: frontend => backend server => controller => book schema => database => send to server => back to frontend

// POST method
/**
 * @route POST /books
 * @description Submit a book from frontend to backend
 * @access Public
 */
router.post("/create-book", verifyAdminToken, postABook);

// GET method (All books)
/**
 * @route GET /books
 * @description Get all books from the database
 * @access Public
 */
router.get("/", getAllBooks);

// GET method (Single book)
/**
 * @route GET /books/:id
 * @description Get a single book from the database
 * @access Public
 */
router.get("/:id", getSingleBook);

// UPDATE method
/**
 * @route PUT /edit/:id
 * @description Update a book from the database
 * @access Public
 */
router.put("/edit/:id", verifyAdminToken, UpdateBook);

// DELETE method
/**
 * @route DELETE /:id
 * @description Delete a book from the database
 * @access Public
 */
router.delete("/:id", verifyAdminToken, deleteABook);

// Search method
/**
 * @route GET /books/search
 * @description Search for books in the database
 * @access Public
 */
router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }
    const books = await Book.find({
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { author: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Server error during book search" });
  }
});

module.exports = router;
