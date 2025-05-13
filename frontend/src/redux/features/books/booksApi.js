import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const booksApi = createApi({
  reducerPath: "booksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/books`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    // Query to fetch all books
    fetchAllBooks: builder.query({
      query: () => "/",
      providesTags: ["Book"],
    }),

    // Query to fetch a single book
    fetchSingleBook: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),

    // Mutation to add a new book
    addBook: builder.mutation({
      query: (newBookData) => ({
        url: "/create-book",
        method: "POST",
        body: newBookData,
      }),
      invalidatesTags: ["Book"],
    }),

    // Mutation to update a book
    updateBook: builder.mutation({
      query: ({ id, data }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Book", id },
        "Book",
      ],
    }),

    // Mutation to delete a book
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),

    // Query to search books
    searchBooks: builder.query({
      query: (searchTerm) => `search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: (result = [], error, searchTerm) => [
        ...result.map(({ _id }) => ({ type: "Book", id: _id })),
        { type: "Book", id: "SEARCH_LIST" },
      ],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchSingleBookQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useSearchBooksQuery,
} = booksApi;

export default booksApi;
