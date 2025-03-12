// import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getImgUrl } from "../../utils/getImgUrl";
import {
  clearItems,
  confirmRemoveItem,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "../../redux/features/cart/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();
  // Tính tổng giá tiền
  const totalPrice = cartItems
    .reduce((total, item) => total + item.newPrice * item.quantity, 0)
    .toFixed(2);

  // Xử lý xoá từng sản phẩm và xoá toàn bộ sản phẩm
  const handleRemoveFromCart = (product) => {
    dispatch(removeItem(product));
  };
  const handleClearCart = () => {
    dispatch(clearItems());
  };
  // Xử lý tăng giảm số lượng sản phẩm
  const handleIncreaseQuantity = (product) => {
    dispatch(increaseQuantity(product));
  };
  const handleDecreaseQuantity = (product) => {
    if (product.quantity > 1) {
      dispatch(decreaseQuantity(product));
    } else {
      dispatch(confirmRemoveItem(product)); // Gọi thunk action khi số lượng = 1
    }
  };

  return (
    <div>
      <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <div className="text-lg font-medium text-gray-900">
              Shopping cart
            </div>
            <div className="ml-3 flex h-7 items-center ">
              <button
                onClick={handleClearCart}
                type="button"
                // onClick={handleClearCart}
                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200  ">
                <span className="">Clear Cart</span>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              {cartItems.length > 0 ? (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((product) => (
                    <li key={product?._id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          alt=""
                          src={`${getImgUrl(product?.coverImage)}`}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                            <h3>
                              <Link to="/">{product?.title}</Link>
                            </h3>
                            <p className="sm:ml-4">${product?.newPrice}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 capitalize">
                            <strong>Category: </strong> {product?.category}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                          <p className="text-gray-500">
                            <strong>Quantity: </strong>{" "}
                            <div className="flex items-center">
                              <button
                                onClick={() => handleDecreaseQuantity(product)}
                                className="px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                                -
                              </button>
                              <p className="mx-2 text-gray-900">
                                {product.quantity}
                              </p>
                              <button
                                onClick={() => handleIncreaseQuantity(product)}
                                className="px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                                +
                              </button>
                            </div>
                          </p>

                          {/* Remove */}
                          <div className="flex">
                            <button
                              onClick={() => handleRemoveFromCart(product)}
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products in cart!</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>${totalPrice ? totalPrice : 0}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              to="/checkout"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
              Checkout
            </Link>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <Link to="/">
              or
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
