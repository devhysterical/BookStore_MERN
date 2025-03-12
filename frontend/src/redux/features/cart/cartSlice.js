import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// Khởi tạo state ban đầu
const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action thêm sản phẩm mới vào giỏ hàng
    addNewItem: (state, action) => {
      state.cartItems.push({ ...action.payload, quantity: 1 });
    },
    // Action xoá từng sản phẩm khỏi giỏ hàng
    removeItem: (state, action) => {
      // TODO: Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng trước khi xoá (có thể cần thông báo nếu không tìm thấy)
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
    },
    // Action xoá toàn bộ sản phẩm khỏi giỏ hàng
    clearItems: (state) => {
      // TODO: Thêm xác nhận của người dùng trước khi xoá toàn bộ sản phẩm trong giỏ hàng
      state.cartItems = [];
    },
    // Action tăng số lượng sản phẩm đã có
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      }
    },
  },
});

export const {
  addNewItem,
  increaseQuantity,
  removeItem,
  clearItems,
  decreaseQuantity,
} = cartSlice.actions;

// Thunk action để xử lý thêm sản phẩm vào giỏ hàng có xác nhận
export const addToCart = (product) => async (dispatch, getState) => {
  const state = getState();
  const existingItem = state.cart.cartItems.find(
    (item) => item._id === product._id
  );

  if (!existingItem) {
    // Nếu sản phẩm chưa có, thêm mới và hiển thị thông báo thành công
    dispatch(addNewItem(product));
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Product added successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    // Nếu sản phẩm đã có, hiển thị hộp thoại xác nhận
    const result = await Swal.fire({
      title: "Already in cart",
      text: "Do you want to continue adding this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, It's Okay!",
    });
    if (result.isConfirmed) {
      dispatch(increaseQuantity(product));
      Swal.fire({
        title: "Added!",
        text: "Added successfully",
        icon: "success",
      });
    }
    // Nếu người dùng không xác nhận, không làm gì cả (hoặc có thể thêm logic khác nếu cần)
  }
};

// Thunk action xác nhận xoá phẩm khỏi giỏ hàng
export const confirmRemoveItem = (product) => async (dispatch) => {
  const result = await Swal.fire({
    title: "Remove item?",
    text: "Do you want to remove this item from your cart?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, remove it!",
  });

  if (result.isConfirmed) {
    dispatch(removeItem(product)); // Gọi action xóa sản phẩm
  }
};

export default cartSlice.reducer;
