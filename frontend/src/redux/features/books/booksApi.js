import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`, // Assuming your book routes are under /api/books
    prepareHeaders: (headers, { getState }) => {
      // Add authorization token if needed for book management
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Book"], // Define tag type for caching
  endpoints: (builder) => ({
    // Query to fetch all books
    fetchAllBooks: builder.query({
      query: () => "/", // Calls GET /api/books
      providesTags: ["Book"], // Provides tag for caching invalidation
      // Quantity should be included by default from the backend
    }),

    // Query to fetch a single book
    fetchSingleBook: builder.query({
      query: (id) => `/${id}`, // Calls GET /api/books/:id
      providesTags: (result, error, id) => [{ type: "Book", id }],
      // Quantity should be included by default
    }),

    // Mutation to add a new book
    addBook: builder.mutation({
      query: (newBookData) => ({
        url: "/",
        method: "POST",
        body: newBookData, // Ensure this includes quantity when adding
      }),
      invalidatesTags: ["Book"], // Invalidate cache after adding
    }),

    // Mutation to update a book
    updateBook: builder.mutation({
      // Expects an object like { id: bookId, data: { field: value, ... } }
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT", // Or PATCH depending on your backend route
        body: data, // 'data' should contain the fields to update, including 'quantity'
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Book", id },
        "Book",
      ], // Invalidate specific book and the list
    }),

    // Mutation to delete a book
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchSingleBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;

export default booksApi;
