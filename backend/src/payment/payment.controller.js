const crypto = require("crypto");
const moment = require("moment");
const qs = require("qs");
const Order = require("../orders/order.model");

// Hàm để sắp xếp các tham số trong đối tượng theo thứ tự chữ cái
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

// Khởi tạo URL thanh toán VNPay
exports.createPaymentUrl = async (req, res) => {
  // Đảm bảo dữ liệu đầu vào là hợp lệ
  const { orderId, amount, orderDescription, bankCode, language } = req.body;
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  let vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURNURL; // Đảm bảo đường dẫn giống như frontend

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const locale = language || "vn";
  const currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId; // Mã đơn hàng của user
  vnp_Params["vnp_OrderInfo"] =
    orderDescription || `Thanh toan don hang ${orderId}`;
  vnp_Params["vnp_OrderType"] = "other"; // Loại đơn hàng, có thể là "other", "topup", "billpayment", v.v.
  vnp_Params["vnp_Amount"] = amount * 100; // Số tiền cần thanh toán (VNPay yêu cầu đơn vị là đồng)
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  // Tạm thời không sử dụng bankCode, có thể thêm vào sau nếu cần
  // if (bankCode !== null && bankCode !== "") {
  //   vnp_Params["vnp_BankCode"] = bankCode;
  // }

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

  res.status(200).json({ paymentUrl: vnpUrl });
};

// Xử lý phản hồi từ VNPay sau khi thanh toán (trả về cho frontend)
exports.vnpayReturn = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = process.env.VNP_HASHSECRET;
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  const orderId = vnp_Params["vnp_TxnRef"];
  const rspCode = vnp_Params["vnp_ResponseCode"];
  const amount = vnp_Params["vnp_Amount"] / 100;

  // Tạo chuỗi query parameters
  const redirectParams = new URLSearchParams({
    orderId: orderId,
    amount: amount,
    success: rspCode === "00" && secureHash === signed, // Kiểm tra cả rspCode và chữ ký
    message:
      rspCode === "00" && secureHash === signed
        ? "Success"
        : "Failed or Invalid Signature", // Cập nhật message
    vnp_ResponseCode: rspCode,
  }).toString();

  // *** Lấy URL frontend từ biến môi trường ***
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  // *** Redirect đến URL đầy đủ của frontend ***
  res.redirect(`${frontendUrl}/payment/result?${redirectParams}`);
};

// Xử lý VNPay IPN (Thông báo máy chủ) - QUAN TRỌNG để xác nhận thanh toán
exports.vnpayIpn = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  const secretKey = process.env.VNP_HASHSECRET;
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Log để so sánh chữ ký
  console.log(`IPN: Received Hash: ${secureHash}`);
  console.log(`IPN: Calculated Hash: ${signed}`);
  console.log(`IPN: Signature Match: ${secureHash === signed}`);

  const orderId = vnp_Params["vnp_TxnRef"];
  const rspCode = vnp_Params["vnp_ResponseCode"];

  try {
    // 1. Kiểm tra chữ ký
    if (secureHash === signed) {
      console.log(`IPN: Signature valid for order ${orderId}.`);

      // 2. Tìm đơn hàng trong database
      const order = await Order.findById(orderId);

      if (order) {
        console.log(
          `IPN: Found order ${orderId} with status ${order.paymentStatus}.`
        );

        // 3. Kiểm tra trạng thái đơn hàng: Chỉ cập nhật nếu đang là "Pending"
        if (order.paymentStatus === "Pending") {
          let newStatus;
          // 4. Cập nhật trạng thái dựa trên rspCode
          if (rspCode === "00") {
            // Thành công
            newStatus = "Confirmed"; // <-- Đặt là Confirmed khi thành công
            console.log(
              `IPN: Payment successful for order ${orderId}. Updating status to ${newStatus}.`
            );
          } else {
            // Thất bại
            newStatus = "Failed"; // <-- Đặt là Failed khi thất bại
            console.log(
              `IPN: Payment failed for order ${orderId} (rspCode: ${rspCode}). Updating status to ${newStatus}.`
            );
          }

          // Cập nhật cả paymentStatus và paymentMethod
          order.paymentStatus = newStatus;
          order.paymentMethod = "VNPay"; // Ghi nhận phương thức là VNPay
          await order.save();

          // 5. Phản hồi thành công cho VNPay (báo đã xử lý IPN)
          res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
        } else {
          // Đơn hàng không ở trạng thái "Pending" (đã được xử lý trước đó)
          console.log(
            `IPN: Order ${orderId} already processed with status ${order.paymentStatus}. No update needed.`
          );
          // Báo cho VNPay biết đơn hàng đã được xác nhận rồi
          res.status(200).json({
            RspCode: "02",
            Message: "Order already confirmed/processed",
          });
        }
      } else {
        // Không tìm thấy đơn hàng
        console.log(`IPN: Order ${orderId} not found.`);
        res.status(200).json({ RspCode: "01", Message: "Order not found" });
      }
    } else {
      // Chữ ký không hợp lệ
      console.log(`IPN: Invalid signature for order ${orderId}.`);
      res.status(200).json({ RspCode: "97", Message: "Invalid Checksum" });
    }
  } catch (error) {
    console.error(`[ERROR] IPN processing error for order ${orderId}:`, error);
    // Trả về lỗi cho VNPay (mặc dù VNPay thường chỉ quan tâm RspCode 00)
    res.status(500).json({ RspCode: "99", Message: "Unknown error" });
  }
};
