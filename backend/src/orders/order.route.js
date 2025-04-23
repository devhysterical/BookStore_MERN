const express = require("express");
const orderController = require("./order.controller");

const router = express.Router();

// order enpoint
router.post("/", orderController.createAOrder);

// get order by user email
router.get("/email/:email", orderController.getOrderByEmail);

// Route để cập nhật đơn hàng theo ID
router.put("/:id", orderController.updateOrder);

module.exports = router;
