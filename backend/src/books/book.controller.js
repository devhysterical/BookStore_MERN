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
    const updateData = req.body; // Data from frontend, should include quantity

    console.log("Received update data:", updateData); // <-- Add log here

    // Ensure quantity is treated as a number if sent as string
    if (updateData.quantity !== undefined) {
      updateData.quantity = parseInt(updateData.quantity, 10);
      if (isNaN(updateData.quantity)) {
        // Handle error if quantity is not a valid number
        return res.status(400).send({ message: "Invalid quantity format." });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // <-- Crucial options
    );

    if (!updatedBook) {
      return res.status(404).send({ message: "Book not found" });
    }

    console.log("Updated book data:", updatedBook); // <-- Add log here
    res.status(200).send({ book: updatedBook }); // Send updated book back
  } catch (error) {
    console.error("Error while updating a book", error);
    // Send back validation errors if they occur
    res
      .status(400)
      .send({ message: "Failed to update book", error: error.message });
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
