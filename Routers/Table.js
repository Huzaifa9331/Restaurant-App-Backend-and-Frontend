import express from "express";
import { getTables, createTable, deleteTable } from "../Controller/Table.js";
import { isAuthenticated, isManager } from "../utils/Auth.js";

const r = express.Router();
r.get("/tables", isAuthenticated, getTables);
r.post("/tables", isAuthenticated, isManager("Manager"), createTable);
r.delete("/tables/:id", isAuthenticated, isManager("Manager"), deleteTable);
export default r;