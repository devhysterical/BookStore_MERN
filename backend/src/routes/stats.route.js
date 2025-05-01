const express = require("express");
const statsController = require("../routes/stats.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// Route để lấy thống kê doanh thu
// Query params: period (day, month, year), date (YYYY-MM-DD), month (YYYY-MM), year (YYYY)
router.get("/sales", verifyAdminToken, statsController.getSalesStats);

// Có thể thêm các route khác sau này (e.g., /orders, /users)

module.exports = router;
