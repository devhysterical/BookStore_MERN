import React, { useState, useMemo } from "react";
import { useGetSalesStatsQuery } from "../../../redux/features/stats/statsApi";
import Loading from "../../../components/Loading";

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const formatMonth = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
};

const StatisticsPage = () => {
  const [period, setPeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const queryValue = useMemo(() => {
    if (period === "day") return formatDate(selectedDate);
    if (period === "month") return formatMonth(selectedDate);
    if (period === "year") return selectedDate.getFullYear().toString();
    return formatDate(new Date()); // Default fallback
  }, [period, selectedDate]);

  const {
    data: statsData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetSalesStatsQuery(
    { period, value: queryValue },
    { skip: !queryValue }
  );

  const generateReport = () => {
    if (!statsData || isLoading || isFetching) {
      return "Generating report...";
    }
    if (isError) {
      return `Error generating report: ${error?.data?.message || error.error}`;
    }

    const { totalSales, totalOrders } = statsData;
    let reportText = `Sales Report for `;

    if (period === "day") {
      reportText += `Date: ${queryValue}\n`;
    } else if (period === "month") {
      const [year, month] = queryValue.split("-");
      reportText += `Month: ${month}/${year}\n`;
    } else if (period === "year") {
      reportText += `Year: ${queryValue}\n`;
    }

    reportText += `------------------------------------\n`;
    reportText += `Total Orders: ${totalOrders}\n`;
    reportText += `Total Sales: $${totalSales.toFixed(2)}\n`;
    reportText += `------------------------------------\n`;

    if (totalOrders === 0) {
      reportText += "Analysis: No sales recorded for this period.\n";
    } else {
      const avgOrderValue = totalSales / totalOrders;
      reportText += `Average Order Value: $${avgOrderValue.toFixed(2)}\n`;
      if (avgOrderValue < 50) {
        reportText +=
          "Suggestion: Consider promotions or bundles to increase average order value.\n";
      } else {
        reportText += "Analysis: Sales performance looks steady.\n";
      }
    }
    return reportText;
  };

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const handleMonthChange = (event) => {
    setSelectedDate(new Date(event.target.value + "-01"));
  };

  const handleYearChange = (event) => {
    setSelectedDate(new Date(event.target.value, 0, 1));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Sales Statistics & Reports
      </h1>
      {/* --- Controls --- */}
      <div className="mb-6 p-4 bg-white shadow rounded-lg flex flex-wrap items-center gap-4">
        {/* Period Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select Period</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}>
            <option value="day">Day</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        {/* Date/Month/Year Picker */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Select {period.charAt(0).toUpperCase() + period.slice(1)}
            </span>
          </label>
          {period === "day" && (
            <input
              type="date"
              className="input input-bordered w-full max-w-xs"
              value={formatDate(selectedDate)}
              onChange={handleDateChange}
              max={formatDate(new Date())}
            />
          )}
          {period === "month" && (
            <input
              type="month"
              className="input input-bordered w-full max-w-xs"
              value={formatMonth(selectedDate)}
              onChange={handleMonthChange}
              max={formatMonth(new Date())}
            />
          )}
          {period === "year" && (
            <input
              type="number"
              placeholder="YYYY"
              min="2000"
              max={new Date().getFullYear()}
              className="input input-bordered w-full max-w-xs"
              value={selectedDate.getFullYear()}
              onChange={handleYearChange}
            />
          )}
        </div>
      </div>
      {/* --- Statistics Display --- */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-title">Total Sales</div>
            <div className="stat-value">
              {isLoading || isFetching ? (
                <span className="loading loading-sm"></span>
              ) : (
                `$${statsData?.totalSales?.toFixed(2) ?? "0.00"}`
              )}
            </div>
            <div className="stat-desc">For selected period</div>
          </div>
        </div>
        <div className="stats shadow bg-white text-secondary-content">
          <div className="stat">
            <div className="stat-title">Total Orders</div>
            <div className="stat-value">
              {isLoading || isFetching ? (
                <span className="loading loading-sm"></span>
              ) : (
                statsData?.totalOrders ?? "0"
              )}
            </div>
            <div className="stat-desc">For selected period</div>
          </div>
        </div>
      </div>

      {/* --- Error Display --- */}
      {isError && (
        <div className="alert alert-error shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Error fetching statistics: {error?.data?.message || error.error}
            </span>
          </div>
        </div>
      )}

      {/* --- Report Section --- */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          Generated Report
        </h2>
        <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
          {generateReport()}
        </pre>
      </div>
    </div>
  );
};

export default StatisticsPage;
