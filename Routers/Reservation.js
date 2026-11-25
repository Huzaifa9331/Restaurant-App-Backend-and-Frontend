import express from "express";
import { createReservation, getMyReservations, cancelReservation, getAllReservations, updateReservationStatus } from "../Controller/Reservation.js";
import { isAuthenticated, isManager } from "../utils/Auth.js";

const r = express.Router();
r.post("/reservations", isAuthenticated, createReservation);
r.get("/reservations/my", isAuthenticated, getMyReservations);
r.get("/reservations", isAuthenticated, isManager("Manager"), getAllReservations);
r.put("/reservations/:id/cancel", isAuthenticated, cancelReservation);
r.put("/reservations/:id/status", isAuthenticated, isManager("Manager"), updateReservationStatus);
export default r;