import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchBooksQuery } from "../redux/features/books/booksApi";
import BookCard from "./books/BooksCard";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const {
    data: books,
    error,
    isLoading,
    isFetching,
  } = useSearchBooksQuery(query, {
    skip: !query,
  });

  if (!query) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-600">
          Please enter a search term in the navigation bar.
        </p>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-600">Loading search results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-600">
          Error fetching search results: {error.message || "An error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      {books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-600">
          No books found matching &quot;{query}&quot;.
        </p>
      )}
    </div>
  );
};

export default SearchResultsPage;
