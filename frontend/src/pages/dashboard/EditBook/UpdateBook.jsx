import React, { useEffect } from "react";
import InputField from "../addBook/InputField";
import SelectField from "../addBook/SelectField";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  useFetchSingleBookQuery,
  useUpdateBookMutation,
} from "../../../redux/features/books/booksApi";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";


const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useFetchSingleBookQuery(id);

  // Extract the actual book data (likely nested under a property)
  const bookData = data?.book || data;

  console.log("Book data received:", bookData); // For debugging

  const [updateBook] = useUpdateBookMutation();
  const { register, handleSubmit, setValue, reset } = useForm();

  // Populate form with book data when it's available
  useEffect(() => {
    if (bookData) {
      console.log("Setting form values with:", bookData);
      setValue("title", bookData.title || "");
      setValue("description", bookData.description || "");
      setValue("category", bookData.category || "");
      setValue("trending", Boolean(bookData.trending));
      setValue("oldPrice", bookData.oldPrice || 0);
      setValue("newPrice", bookData.newPrice || 0);
      setValue("coverImage", bookData.coverImage || "");
    }
  }, [bookData, setValue]);

  const onSubmit = async (data) => {
    const updateBookData = {
      title: data.title,
      description: data.description,
      category: data.category,
      trending: data.trending,
      oldPrice: Number(data.oldPrice),
      newPrice: Number(data.newPrice),
      coverImage: data.coverImage || bookData.coverImage,
    };
    try {
      // Check if token exists first
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Authentication Error",
          text: "You are not logged in. Please log in to update books.",
          icon: "error",
        });
        navigate("/login"); // Redirect to login
        return;
      }
      // const result = await updateBook({ id, ...updateBookData }).unwrap();
      await updateBook({ id, ...updateBookData }).unwrap();
      Swal.fire({
        title: "Book Updated",
        text: "Your book is updated successfully!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Back to Books",
        cancelButtonText: "Stay Here",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/manage-books");
        }
      });
      await refetch();
    } catch (error) {
      console.error("Failed to update book:", error);

      // Handle different error scenarios
      if (error.status === 403 || error.response?.status === 403) {
        Swal.fire({
          title: "Permission Denied",
          text: "You don't have permission to update this book. Please log in with an admin account.",
          icon: "error",
        });
        // Optional: Redirect to login page
        // navigate("/login");
      } else {
        Swal.fire({
          title: "Update Failed",
          text:
            error.data?.message ||
            error.response?.data?.message ||
            "Failed to update book",
          icon: "error",
        });
      }
    }
  };


  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-red-500 text-center p-4">
        Error fetching book data
      </div>
    );

  return (
    <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />

        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
        />
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register("trending")}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">
              Trending
            </span>
          </label>
        </div>

        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />

        <InputField
          label="Cover Image URL"
          name="coverImage"
          type="text"
          placeholder="Cover Image URL"
          register={register}
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
