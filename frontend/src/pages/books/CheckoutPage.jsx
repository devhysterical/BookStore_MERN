import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "../../redux/features/orders/ordersApi";
import Swal from "sweetalert2";
import axios from "axios";
import getBaseUrl from "../../utils/baseURL";
import { useState } from "react";

// --- Giả sử tỷ giá cố định ---
const USD_TO_VND_RATE = 25000; // Ví dụ: 1 USD = 25000 VND

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  // totalPrice đang là USD dạng string (ví dụ "187.00")
  const totalPriceUSD = cartItems
    .reduce((total, item) => total + item.newPrice * item.quantity, 0)
    .toFixed(2);
  const { currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdatingOrder }] =
    useUpdateOrderMutation();
  const navigate = useNavigate();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);

  const handleVNPayPayment = async () => {
    if (!pendingOrder) {
      Swal.fire("Error", "No order found to process payment.", "error");
      return;
    }
    try {
      const orderId = pendingOrder._id;
      // Lấy totalPrice từ pendingOrder hoặc tính lại nếu cần, đảm bảo là số
      const amountUSD = parseFloat(pendingOrder.totalPrice);

      // --- Chuyển đổi sang VND ---
      const amountVND = Math.round(amountUSD * USD_TO_VND_RATE);
      // --------------------------

      console.log(`Converting ${amountUSD} USD to ${amountVND} VND`); // Log để kiểm tra

      const response = await axios.post(
        `${getBaseUrl()}/api/payment/create_payment_url`,
        {
          orderId: orderId,
          amount: amountVND, // --- Gửi số tiền VND ---
          orderDescription: `Thanh toan don hang ${orderId}`,
        }
      );

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        setPendingOrder(null);
        setShowPaymentOptions(false);
        window.location.href = paymentUrl;
      } else {
        Swal.fire("Error", "Could not create VNPay payment URL.", "error");
      }
    } catch (error) {
      console.error("VNPay initiation error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to initiate VNPay payment.",
        "error"
      );
    }
  };

  const handleCODPayment = async () => {
    if (!pendingOrder) {
      Swal.fire("Error", "No order found to process payment.", "error");
      return;
    }
    try {
      // Gọi API để cập nhật trạng thái đơn hàng cho COD
      await updateOrder({
        id: pendingOrder._id,
        data: {
          paymentMethod: "COD",
          paymentStatus: "Pending",
        },
      }).unwrap();

      Swal.fire(
        "Confirm Order",
        "Your order has been placed successfully (Cash on Delivery).",
        "success"
      );
      setPendingOrder(null);
      setShowPaymentOptions(false);
      navigate("/orders");
    } catch (error) {
      console.error("COD processing error:", error);
      Swal.fire(
        "Error",
        error.data?.message || "Could not confirm COD order. Please try again.",
        "error"
      );
    }
  };

  const onSubmit = async (data) => {
    const orderDetails = {
      name: data.name,
      email: currentUser?.email || data.email,
      address: {
        street: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIDs: cartItems.map((item) => item?._id),
      totalPrice: parseFloat(totalPriceUSD), // Lưu giá gốc USD vào DB
      paymentMethod: "Pending",
      paymentStatus: "Pending",
    };

    try {
      const createdOrder = await createOrder(orderDetails).unwrap();
      console.log("Order created response:", createdOrder);

      if (createdOrder && createdOrder._id) {
        setPendingOrder(createdOrder);
        setShowPaymentOptions(true);
      } else {
        console.error(
          "API response is not a valid order object:",
          createdOrder
        );
        Swal.fire(
          "Error",
          "Invalid response from server after creating order.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire(
        "Error",
        error.data?.message || "Failed to create order. Please try again.",
        "error"
      );
    }
  };

  if (isCreatingOrder) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div>
              <h2 className="font-semibold text-xl text-gray-600 mb-2">
                Order Summary
              </h2>
              <p className="text-gray-500 mb-2">
                Total Price: ${totalPriceUSD}
              </p>{" "}
              {/* Hiển thị giá USD */}
              <p className="text-gray-500 mb-6">
                Items: {cartItems.length > 0 ? cartItems.length : 0}
              </p>
            </div>

            {!showPaymentOptions && (
              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">Shipping Details</p>
                    <p>Please fill out all the fields.</p>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          {...register("name", {
                            required: "Full Name is required",
                          })}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        />
                        {errors.name && (
                          <span className="text-red-500 text-xs">
                            {errors.name.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-5">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          defaultValue={currentUser?.email}
                          placeholder="email@domain.com"
                        />
                        {errors.email && (
                          <span className="text-red-500 text-xs">
                            {errors.email.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-5">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          {...register("phone", {
                            required: "Phone number is required",
                          })}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="+123 456 7890"
                        />
                        {errors.phone && (
                          <span className="text-red-500 text-xs">
                            {errors.phone.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-3">
                        <label htmlFor="address">Address / Street</label>
                        <input
                          type="text"
                          id="address"
                          {...register("address", {
                            required: "Address is required",
                          })}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder=""
                        />
                        {errors.address && (
                          <span className="text-red-500 text-xs">
                            {errors.address.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          id="city"
                          {...register("city", {
                            required: "City is required",
                          })}
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder=""
                        />
                        {errors.city && (
                          <span className="text-red-500 text-xs">
                            {errors.city.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="country">Country / region</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <input
                            id="country"
                            placeholder="Country"
                            {...register("country", {
                              required: "Country is required",
                            })}
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          />
                        </div>
                        {errors.country && (
                          <span className="text-red-500 text-xs">
                            {errors.country.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="state">State / province</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <input
                            id="state"
                            placeholder="State"
                            {...register("state", {
                              required: "State is required",
                            })}
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          />
                        </div>
                        {errors.state && (
                          <span className="text-red-500 text-xs">
                            {errors.state.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor="zipcode">Zipcode</label>
                        <input
                          type="text"
                          id="zipcode"
                          {...register("zipcode", {
                            required: "Zipcode is required",
                          })}
                          className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder=""
                        />
                        {errors.zipcode && (
                          <span className="text-red-500 text-xs">
                            {errors.zipcode.message}
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-5 mt-3">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            id="billing_same"
                            {...register("billing_same", {
                              required: "You must agree to the terms",
                            })}
                            className="form-checkbox"
                          />
                          <label htmlFor="billing_same" className="ml-2">
                            I agree to the{" "}
                            <Link
                              to="/terms"
                              className="underline underline-offset-2 text-blue-600">
                              Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                              to="/policy"
                              className="underline underline-offset-2 text-blue-600">
                              Shopping Policy.
                            </Link>
                          </label>
                        </div>
                        {errors.billing_same && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.billing_same.message}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            type="submit"
                            disabled={isCreatingOrder}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                            {isCreatingOrder
                              ? "Processing..."
                              : "Proceed to Payment Options"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {showPaymentOptions && pendingOrder && (
              <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                <h2 className="font-semibold text-xl text-gray-600 mb-6 text-center">
                  Choose Payment Method
                </h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                  <button
                    onClick={handleCODPayment}
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded transition duration-200 w-full md:w-auto">
                    Cash On Delivery (COD)
                  </button>

                  <button
                    onClick={handleVNPayPayment}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-200 w-full md:w-auto">
                    Online Payment (VNPay)
                  </button>
                </div>
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setShowPaymentOptions(false);
                      setPendingOrder(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm">
                    Back to Shipping Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
