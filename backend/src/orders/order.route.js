const express = require("express");
const orderController = require("./order.controller");
const verifyAdmin = require("../middleware/verifyAdminToken");

const router = express.Router();

router.post("/", orderController.createAOrder);
router.get("/email/:email", orderController.getOrderByEmail);

router.use(verifyAdmin);

router.get("/", orderController.getAllOrders); // GET all orders (Admin)
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);

module.exports = router;
