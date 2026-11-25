import express from "express";
import { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, payOrder, cancelOrder } from "../Controller/Order.js";
import { isAuthenticated, isManager } from "../utils/Auth.js";

const r = express.Router();
r.post("/orders", isAuthenticated, createOrder);
r.get("/orders/my", isAuthenticated, getMyOrders);        // must stay above /orders/:id
r.get("/orders", isAuthenticated, isManager("Manager"), getAllOrders);
r.get("/orders/:id", isAuthenticated, getOrder);
r.put("/orders/:id/status", isAuthenticated, isManager("Manager"), updateOrderStatus);
r.put("/orders/:id/pay", isAuthenticated, payOrder);
r.put("/orders/:id/cancel", isAuthenticated, cancelOrder);
export default r;