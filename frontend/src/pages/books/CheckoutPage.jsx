// import React from "react";
// import { current } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Component hiển thị trang thanh toán (CheckoutPage)
const CheckoutPage = () => {
  // Lấy danh sách sản phẩm trong giỏ hàng từ Redux store
  const cartItems = useSelector((state) => state.cart.cartItems);
  // Giả sử người dùng hiện tại được lưu trong state.auth.currentUser
  const currentUser = useSelector((state) => state.auth?.currentUser);

  // Tính tổng tiền của các sản phẩm trong giỏ hàng
  const totalPrice = cartItems
    .reduce((total, item) => total + item.newPrice * item.quantity, 0)
    .toFixed(2);

  // Khởi tạo các hàm hỗ trợ từ react-hook-form để xử lý form
  const {
    register, // Hàm đăng ký các input của form
    handleSubmit, // Hàm xử lý submit form
    watch, // Hàm theo dõi giá trị của input
    formState: { errors }, // Lấy thông tin lỗi của form
  } = useForm();

  // Theo dõi checkbox đồng ý với Terms & Conditions
  const isChecked = watch("billing_same");

  // Hàm xử lý submit form
  const onSubmit = (data) => {
    console.log(data);
    // Xử lý đặt hàng: tạo đối tượng đơn hàng mới
    const newOrder = {
      name: data.name,
      email: currentUser?.email, // Email lấy từ người dùng hiện tại
      address: {
        street: data.address,
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIDs: cartItems.map((item) => item?._id),
      totalPrice: totalPrice,
    };
    console.log(newOrder);
    // Có thể gửi đơn hàng mới này lên server hoặc xử lý tiếp theo tại đây
  };

  return (
    <section>
      {/* Container tổng cho trang thanh toán */}
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div>
              {/* Tiêu đề và thông tin tóm tắt của đơn hàng */}
              <h2 className="font-semibold text-xl text-gray-600 mb-2">
                Cash On Delivery
              </h2>
              <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
              <p className="text-gray-500 mb-6">
                Items: {cartItems.length > 0 ? cartItems.length : 0}
              </p>
            </div>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              {/* Form đặt hàng */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
              >
                {/* Phần mô tả chung của form */}
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Personal Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                {/* Phần nhập thông tin chi tiết */}
                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    {/* Input Full Name */}
                    <div className="md:col-span-5">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        {...register("name", { required: true })}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                      />
                      {errors.name && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input Email Address */}
                    <div className="md:col-span-5">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="text"
                        id="email"
                        {...register("email", { required: true })}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        defaultValue={currentUser?.email}
                        placeholder="email@domain.com"
                      />
                      {errors.email && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input Phone Number */}
                    <div className="md:col-span-5">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="number"
                        id="phone"
                        {...register("phone", { required: true })}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder="+123 456 7890"
                      />
                      {errors.phone && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input Address / Street */}
                    <div className="md:col-span-3">
                      <label htmlFor="address">Address / Street</label>
                      <input
                        type="text"
                        id="address"
                        {...register("address", { required: true })}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder=""
                      />
                      {errors.address && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input City */}
                    <div className="md:col-span-2">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        {...register("city", { required: true })}
                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder=""
                      />
                      {errors.city && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input Country / region */}
                    <div className="md:col-span-2">
                      <label htmlFor="country">Country / region</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          id="country"
                          placeholder="Country"
                          {...register("country", { required: true })}
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                        />
                        {/* Nút xóa nội dung (không có hành động cụ thể) */}
                        <button
                          tabIndex="-1"
                          className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600"
                        >
                          <svg
                            className="w-4 h-4 mx-2 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        {/* Nút hiển thị dropdown (không có hành động cụ thể) */}
                        <button
                          tabIndex="-1"
                          className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
                        >
                          <svg
                            className="w-4 h-4 mx-2 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                      </div>
                      {errors.country && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input State / province */}
                    <div className="md:col-span-2">
                      <label htmlFor="state">State / province</label>
                      <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                        <input
                          id="state"
                          placeholder="State"
                          {...register("state", { required: true })}
                          className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                        />
                        {/* Nút xóa nội dung */}
                        <button className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600">
                          <svg
                            className="w-4 h-4 mx-2 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        {/* Nút hiển thị dropdown */}
                        <button
                          tabIndex="-1"
                          className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
                        >
                          <svg
                            className="w-4 h-4 mx-2 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                      </div>
                      {errors.state && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Input Zipcode */}
                    <div className="md:col-span-1">
                      <label htmlFor="zipcode">Zipcode</label>
                      <input
                        type="text"
                        id="zipcode"
                        {...register("zipcode", { required: true })}
                        className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        placeholder=""
                      />
                      {errors.zipcode && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Checkbox đồng ý với Terms & Conditions */}
                    <div className="md:col-span-5 mt-3">
                      <div className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="billing_same"
                          {...register("billing_same", { required: true })}
                          className="form-checkbox"
                        />
                        <label htmlFor="billing_same" className="ml-2">
                          I agree to the{" "}
                          <Link className="underline underline-offset-2 text-blue-600">
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link className="underline underline-offset-2 text-blue-600">
                            Shopping Policy.
                          </Link>
                        </label>
                      </div>
                      {errors.billing_same && (
                        <span className="text-red-500">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Nút submit đặt hàng */}
                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          disabled={!isChecked}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Place an Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
              {/* Kết thúc form */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
