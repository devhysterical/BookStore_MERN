import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useFetchSingleBookQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: bookData,
    isLoading: isLoadingBook,
    isError,
    error: bookError,
  } = useFetchSingleBookQuery(id);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Populate form with existing book data once loaded
  useEffect(() => {
    if (bookData?.book) {
      // Adjust based on your API response structure
      const {
        title,
        description,
        category,
        trending,
        coverImage,
        oldPrice,
        newPrice,
        quantity,
      } = bookData.book;
      reset({
        title,
        description,
        category,
        trending,
        coverImage,
        oldPrice,
        newPrice,
        quantity,
      }); // Include quantity
    }
  }, [bookData, reset]);

  const onSubmit = async (formData) => {
    try {
      // Convert price and quantity fields back to numbers if needed by backend/validation
      const dataToUpdate = {
        ...formData,
        oldPrice: parseFloat(formData.oldPrice),
        newPrice: parseFloat(formData.newPrice),
        quantity: parseInt(formData.quantity, 10), // Ensure quantity is an integer
        trending: formData.trending === "true" || formData.trending === true, // Handle boolean conversion if needed
      };

      // Remove fields that shouldn't be sent or are empty if necessary
      // e.g., if coverImage is not changed, don't send it

      await updateBook({ id, data: dataToUpdate }).unwrap();
      toast.success("Book updated successfully!");
      navigate("/dashboard/manage-books"); // Navigate back to manage page
    } catch (err) {
      toast.error(`Failed to update book: ${err?.data?.message || err.error}`);
    }
  };

  if (isLoadingBook) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center mt-10">
        Error loading book details:{" "}
        {bookError?.data?.message || bookError.error}
      </div>
    );
  if (!bookData?.book)
    return <div className="text-center mt-10">Book not found.</div>; // Handle case where book doesn't exist

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Book</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto bg-white p-8 shadow-md rounded-lg space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            className="input input-bordered w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            className="textarea textarea-bordered w-full"
            rows="3"></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            {...register("category", { required: "Category is required" })}
            className="input input-bordered w-full"
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Cover Image URL */}
        <div>
          <label
            htmlFor="coverImage"
            className="block text-sm font-medium text-gray-700">
            Cover Image URL
          </label>
          <input
            type="text"
            id="coverImage"
            {...register("coverImage", { required: "Image URL is required" })}
            className="input input-bordered w-full"
          />
          {errors.coverImage && (
            <p className="text-red-500 text-xs mt-1">
              {errors.coverImage.message}
            </p>
          )}
        </div>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="oldPrice"
              className="block text-sm font-medium text-gray-700">
              Old Price
            </label>
            <input
              type="number"
              step="0.01"
              id="oldPrice"
              {...register("oldPrice", {
                required: "Old price is required",
                valueAsNumber: true,
              })}
              className="input input-bordered w-full"
            />
            {errors.oldPrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.oldPrice.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="newPrice"
              className="block text-sm font-medium text-gray-700">
              New Price
            </label>
            <input
              type="number"
              step="0.01"
              id="newPrice"
              {...register("newPrice", {
                required: "New price is required",
                valueAsNumber: true,
              })}
              className="input input-bordered w-full"
            />
            {errors.newPrice && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPrice.message}
              </p>
            )}
          </div>
        </div>

        {/* --- Add Quantity Field --- */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            {...register("quantity", {
              required: "Quantity is required",
              valueAsNumber: true, // Ensure value is treated as number
              min: { value: 0, message: "Quantity cannot be negative" }, // Add validation
            })}
            className="input input-bordered w-full"
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>
        {/* --- End Quantity Field --- */}

        {/* Trending */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start space-x-2">
            <input
              type="checkbox"
              {...register("trending")}
              className="checkbox checkbox-primary"
            />
            <span className="label-text">Mark as Trending</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isUpdating}>
          {isUpdating ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Update Book"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
