// import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";

import { getImgUrl } from "../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useFetchSingleBookQuery } from "../../redux/features/books/booksApi";

const SingleBook = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useFetchSingleBookQuery(id);

  // Properly extract the book data from the response
  const bookData = data?.book;

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong to load book info</div>;
  if (!bookData) return <div>Book information not found</div>;

  return (
    <div className="max-w-lg shadow-md p-5">
      <h1 className="text-2xl font-bold mb-6">{bookData.title}</h1>

      <div className="">
        <div>
          <img
            src={`${getImgUrl(bookData.coverImage)}`}
            alt={bookData.title}
            className="mb-8"
          />
        </div>

        <div className="mb-5">
          <p className="text-gray-700 mb-2">
            <strong>Author:</strong> {bookData.author || "admin"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Published:</strong>{" "}
            {new Date(bookData?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4 capitalize">
            <strong>Category:</strong> {bookData?.category}
          </p>
          <p className="text-gray-700">
            <strong>Description:</strong> {bookData.description}
          </p>
        </div>

        <button
          onClick={() => handleAddToCart(bookData)}
          className="btn-primary px-6 space-x-1 flex items-center gap-1 ">
          <FiShoppingCart className="" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default SingleBook;
