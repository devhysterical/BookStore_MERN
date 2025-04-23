const express = require("express");
const router = express.Router();
const {
  createPaymentUrl,
  vnpayReturn,
  vnpayIpn,
} = require("./payment.controller");

// Route to create payment URL
router.post("/create_payment_url", createPaymentUrl);

// Route for VNPay to return to after payment (client-side)
router.get("/vnpay_return", vnpayReturn);

// Route for VNPay Instant Payment Notification (server-side)
router.get("/vnpay_ipn", vnpayIpn);

module.exports = router;
