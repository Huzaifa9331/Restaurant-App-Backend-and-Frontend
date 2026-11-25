import express from "express";
import { getMenu, createItem, updateItem, deleteItem } from "../Controller/Menu.js";
import { isAuthenticated, isManager } from "../utils/Auth.js";

const r = express.Router();
r.get("/menu", getMenu);
r.post("/menu", isAuthenticated, isManager("Manager"), createItem);
r.put("/menu/:id", isAuthenticated, isManager("Manager"), updateItem);
r.delete("/menu/:id", isAuthenticated, isManager("Manager"), deleteItem);
export default r;