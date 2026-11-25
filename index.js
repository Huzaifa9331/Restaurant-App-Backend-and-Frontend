import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./db.js";
import userRouter from "./Routers/User.js";
import menuRouter from "./Routers/Menu.js";
import orderRouter from "./Routers/Order.js";
import tableRouter from "./Routers/Table.js";
import reservationRouter from "./Routers/Reservation.js";

const app = express();

app.use((req, res, next) => { console.log("REQUEST:", req.method, req.url); next(); });
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", userRouter);
app.use("/api/v1", menuRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", tableRouter);
app.use("/api/v1", reservationRouter);

app.get("/", (req, res) => res.json({ success: true, message: "Restaurant API is working" }));

app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` }));

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  let status = err.status || 500;
  if (err.name === "CastError" || err.name === "ValidationError") status = 400;
  if (err.code === 11000) status = 409;
  res.status(status).json({ success: false, message: err.code === 11000 ? "Already exists" : err.message || "Server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};
startServer();