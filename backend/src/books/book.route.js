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

module.exports = router;
