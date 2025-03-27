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

module.exports = {
  createAOrder,
  getOrderByEmail,
};
