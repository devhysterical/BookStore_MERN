const Order = require("../orders/order.model");
const mongoose = require("mongoose");

// Helper function to get start and end dates for a period
const getDateRange = (period, value) => {
  let startDate, endDate;
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  switch (period) {
    case "day":
      // value should be YYYY-MM-DD
      startDate = new Date(value);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      break;
    case "month":
      // value should be YYYY-MM
      const [yearM, monthM] = value.split("-").map(Number);
      startDate = new Date(yearM, monthM - 1, 1);
      endDate = new Date(yearM, monthM, 1);
      break;
    case "year":
      // value should be YYYY
      const yearY = Number(value);
      startDate = new Date(yearY, 0, 1);
      endDate = new Date(yearY + 1, 0, 1);
      break;
    default:
      startDate = new Date(now);
      endDate = new Date(now);
      endDate.setDate(now.getDate() + 1);
  }
  return { startDate, endDate };
};

const getSalesStats = async (req, res) => {
  const { period, date, month, year } = req.query;
  let value = date || month || year;

  if (!period || !value) {
    return res
      .status(400)
      .json({
        message:
          "Missing required query parameters: period and date/month/year",
      });
  }

  try {
    const { startDate, endDate } = getDateRange(period, value);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          paymentStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalOrders: 1,
        },
      },
    ]);

    const result = salesData[0] || { totalSales: 0, totalOrders: 0 };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch sales statistics",
        error: error.message,
      });
  }
};

module.exports = {
  getSalesStats,
};
