import Order from "../Schema/Order.js";
import Menu from "../Schema/Menu.js";

const withDetails = (q) =>
  q.populate("orderItems.menuItem", "name image price").populate("user", "name email");

export const createOrder = async (req, res) => {
  try {
    const { orderItems, deliveryAddress, paymentMethod } = req.body;
    if (!Array.isArray(orderItems) || orderItems.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });
    if (!deliveryAddress?.trim())
      return res.status(400).json({ success: false, message: "Delivery address is required" });

    const menu = await Menu.find({ _id: { $in: orderItems.map((i) => i.menuItem) } });
    const byId = new Map(menu.map((m) => [String(m._id), m]));

    let total = 0;
    const items = [];
    for (const i of orderItems) {
      const m = byId.get(String(i.menuItem));
      const qty = Number(i.quantity);
      if (!m || !m.isAvailable)
        return res.status(400).json({ success: false, message: "An item in your cart is unavailable" });
      if (!Number.isInteger(qty) || qty < 1)
        return res.status(400).json({ success: false, message: "Invalid quantity" });
      items.push({ menuItem: m._id, quantity: qty, price: m.price });
      total += m.price * qty;
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: items,
      totalAmount: total,
      deliveryAddress: deliveryAddress.trim(),
      paymentMethod: paymentMethod === "Online" ? "Online" : "Cash On Delivery",
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await withDetails(Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await withDetails(Order.findById(req.params.id));
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (String(order.user._id) !== String(req.user._id) && req.user.role !== "Manager")
      return res.status(403).json({ success: false, message: "Not allowed" });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await withDetails(Order.find().sort({ createdAt: -1 }));
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const allowed = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];
    if (!allowed.includes(req.body.orderStatus))
      return res.status(400).json({ success: false, message: "Invalid status" });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    order.orderStatus = req.body.orderStatus;
    if (order.orderStatus === "Completed" && order.paymentMethod === "Cash On Delivery")
      order.paymentStatus = "Paid";
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || String(order.user) !== String(req.user._id))
      return res.status(404).json({ success: false, message: "Order not found" });
    if (order.paymentMethod !== "Online")
      return res.status(400).json({ success: false, message: "This order is Cash On Delivery" });
    order.paymentStatus = "Paid"; // simulated payment for the assignment
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || String(order.user) !== String(req.user._id))
      return res.status(404).json({ success: false, message: "Order not found" });
    if (order.orderStatus !== "Pending")
      return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
    order.orderStatus = "Cancelled";
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};