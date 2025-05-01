import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useFetchAllBooksQuery,
  useDeleteBookMutation,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import { FaEdit, FaTrashAlt, FaSave } from "react-icons/fa";

const ManageBooks = () => {
  const { data, isLoading, isError, error } = useFetchAllBooksQuery();
  const [deleteBook] = useDeleteBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  console.log("Fetched books data:", data);

  const [quantityInputs, setQuantityInputs] = useState({});

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id).unwrap();
        toast.success("Book deleted successfully!");
      } catch (err) {
        toast.error(
          `Failed to delete book: ${err?.data?.message || err.error}`
        );
      }
    }
  };

  const handleQuantityInputChange = (bookId, value) => {
    setQuantityInputs((prev) => ({
      ...prev,
      [bookId]: value,
    }));
  };

  const handleUpdateQuantity = async (bookId) => {
    const newQuantityStr = quantityInputs[bookId];
    if (newQuantityStr === undefined || newQuantityStr.trim() === "") {
      toast.warn("Please enter a quantity.");
      return;
    }

    const newQuantity = parseInt(newQuantityStr, 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error("Invalid quantity. Please enter a non-negative number.");
      return;
    }

    try {
      await updateBook({
        id: bookId,
        data: { quantity: newQuantity },
      }).unwrap();
      toast.success("Quantity updated successfully!");
      setQuantityInputs((prev) => ({ ...prev, [bookId]: undefined }));
    } catch (err) {
      toast.error(
        `Failed to update quantity: ${err?.data?.message || err.error}`
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-10 p-4 bg-red-100 rounded-md">
        Error loading books: {error?.data?.message || error.error}
      </div>
    );

  const books = data?.book || data || [];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Books Inventory
      </h1>

      {books.length === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true">
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No books found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add new books to manage inventory.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard/add-new-books"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Add New Book
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Qty
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr
                    key={book._id}
                    className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                      {book.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {book.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
                      ${book.newPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {book.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          value={quantityInputs[book._id] ?? ""}
                          onChange={(e) =>
                            handleQuantityInputChange(book._id, e.target.value)
                          }
                          className="input input-bordered input-sm w-20 py-1"
                          placeholder="New Qty"
                          disabled={isUpdating}
                          aria-label={`New quantity for ${book.title}`}
                        />
                        <button
                          onClick={() => handleUpdateQuantity(book._id)}
                          className={`btn btn-sm ${
                            quantityInputs[book._id] === undefined
                              ? "btn-disabled"
                              : "btn-success"
                          } text-white`}
                          disabled={
                            isUpdating || quantityInputs[book._id] === undefined
                          }
                          title="Save new quantity"
                          aria-label={`Save new quantity for ${book.title}`}>
                          <FaSave className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center space-x-3">
                        <Link
                          to={`/dashboard/edit-book/${book._id}`}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors duration-150"
                          title="Edit Book Details">
                          <FaEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150"
                          title="Delete Book">
                          <FaTrashAlt className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
