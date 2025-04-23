const Order = require("./order.model");

// order enpoint
const createAOrder = async (req, res) => {
  try {
    const newOrder = await Order(req.body);
    const saveOrder = await newOrder.save();
    return res.status(201).json(saveOrder);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get order by user email
const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email: email }).sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ message: "No order found" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controller để cập nhật đơn hàng
const updateOrder = async (req, res) => {
  try {
    // Đảm bảo try bao bọc toàn bộ
    const orderId = req.params.id;
    const updateData = req.body;

    console.log(`Attempting to update order ${orderId} with data:`, updateData); // Thêm log để kiểm tra

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true } // runValidators để kiểm tra schema
    );

    if (!updatedOrder) {
      console.log(`Order ${orderId} not found for update.`); // Log nếu không tìm thấy
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`Order ${orderId} updated successfully:`, updatedOrder); // Log khi thành công
    res.status(200).json(updatedOrder);
  } catch (error) {
    // *** Log lỗi chi tiết ra console backend ***
    console.error(`[ERROR] Failed to update order ${req.params.id}:`, error);
    // Trả về lỗi 500 chung chung cho client
    res
      .status(500)
      .json({
        message: "Internal server error while updating order",
        error: error.message,
      });
  }
};

module.exports = {
  createAOrder,
  getOrderByEmail,
  updateOrder,
};
