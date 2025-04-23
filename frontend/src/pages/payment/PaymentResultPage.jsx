import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import getBaseUrl from "../../utils/baseURL";

const PaymentResultPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentResult = {
      success: params.get("success") === "true",
      message: params.get("message"),
      orderId: params.get("orderId"),
      amount: params.get("amount"),
      vnp_ResponseCode: params.get("vnp_ResponseCode"),
    };
    setResult(paymentResult);
    setLoading(false);

    // Chỉ fetch trạng thái nếu có orderId và thanh toán ban đầu có vẻ thành công
    // (IPN vẫn là nguồn xác thực cuối cùng)
    if (paymentResult.orderId && paymentResult.success) {
      const fetchOrderStatus = async () => {
        try {
          // *** Sử dụng getBaseUrl() để tạo URL backend đầy đủ ***
          const apiUrl = `${getBaseUrl()}/api/orders/${paymentResult.orderId}`;
          console.log("Fetching order status from:", apiUrl); // Log URL để kiểm tra
          const response = await fetch(apiUrl); // Gọi đến backend

          // Kiểm tra xem response có OK không trước khi parse JSON
          if (!response.ok) {
            // Nếu response không OK (vd: 404, 500), throw lỗi
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json(); // Parse JSON từ backend
          console.log("Fetched order status data:", data);

          // Cập nhật state với dữ liệu mới từ API (ví dụ: trạng thái thực tế)
          // Giả sử API trả về đối tượng order đầy đủ
          setResult((prevResult) => ({
            ...prevResult,
            // Cập nhật thêm các trường từ data nếu cần, ví dụ:
            // actualPaymentStatus: data.paymentStatus
          }));
        } catch (error) {
          console.error("Error fetching order status:", error);
          // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
        }
      };
      // Thực hiện fetch sau một khoảng trễ để chờ IPN có thể đã xử lý
      const timer = setTimeout(fetchOrderStatus, 3000); // 3 seconds delay

      return () => clearTimeout(timer);
    }
  }, [location]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-6 text-center">
      {result?.success ? (
        <>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Payment Successful!
          </h2>
          <p>
            Your payment for order{" "}
            <span className="font-bold">{result.orderId}</span> was successful.
            {/* Optional: Hiển thị trạng thái thực tế nếu đã fetch được */}
            {/* {result.actualPaymentStatus && ` (Status: ${result.actualPaymentStatus})`} */}
          </p>
          <p>
            Amount: <span className="font-bold">{result.amount} VND</span>
          </p>
          <Link
            to="/orders"
            className="text-blue-600 hover:underline mt-4 inline-block">
            View Your Orders
          </Link>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Payment Failed
          </h2>
          <p>
            There was an issue processing your payment for order{" "}
            <span className="font-bold">{result?.orderId || "N/A"}</span>.
          </p>
          <p>
            Reason: {result?.message || "Unknown error"} (Code:{" "}
            {result?.vnp_ResponseCode || "N/A"})
          </p>
          <Link
            to="/checkout"
            className="text-blue-600 hover:underline mt-4 inline-block">
            Try Again
          </Link>
          <br />
          <Link
            to="/"
            className="text-gray-600 hover:underline mt-2 inline-block">
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentResultPage;
