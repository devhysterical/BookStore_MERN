import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const statsApi = createApi({
  reducerPath: "statsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/stats`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Stats"],
  endpoints: (builder) => ({
    getSalesStats: builder.query({
      query: ({ period, value }) => {
        let params = { period };
        if (period === "day") params.date = value;
        else if (period === "month") params.month = value;
        else if (period === "year") params.year = value;

        return {
          url: "/sales",
          params: params,
        };
      },
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  useGetSalesStatsQuery,
} = statsApi;

export default statsApi;
