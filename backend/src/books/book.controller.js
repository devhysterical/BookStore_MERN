const Book = require("./book.model");

// POST method
const postABook = async (req, res) => {
  try {
    const newBook = await Book(req.body);
    await newBook.save();
    res
      .status(200)
      .send({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("Error while creating a book", error);
    res.status(500).send({ message: "Failed to create a book" });
  }
};

// GET method (All books)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.status(200).send({ book: books });
  } catch (error) {
    console.error("Error while fetching all books", error);
    res.status(500).send({ message: "Failed to fetch all books" });
  }
};

// GET method (Single book)
const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send({ message: "Book is not found" });
    }
    res.status(200).send({ book: book });
  } catch (error) {
    console.error("Error while fetching a book", error);
    res.status(500).send({ message: "Failed to fetch a book" });
  }
};

// UPDATE method
const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).send({ message: "Book is not found" });
    }
    res.status(200).send({ book: updatedBook });
  } catch (error) {
    console.error("Error while updating a book", error);
    res.status(500).send({ message: "Failed to update a book" });
  }
};

// DELETE method
const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).send({ message: "Book is not found" });
    }
    res.status(200).send({ book: deletedBook });
  } catch (error) {
    console.error("Error while deleting a book", error);
    res.status(500).send({ message: "Failed to delete a book" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
};
