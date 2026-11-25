import Reservation from "../Schema/Reservation.js";
import Table from "../Schema/Table.js";

const withDetails = (q) => q.populate("table", "tableNumber seats").populate("user", "name email");

export const createReservation = async (req, res) => {
  const { table, date, guests, specialRequests } = req.body;
  const when = new Date(date);
  if (!table || isNaN(when) || !guests)
    return res.status(400).json({ success: false, message: "Table, date and guests are required" });
  if (when < new Date())
    return res.status(400).json({ success: false, message: "Choose a future date and time" });

  const t = await Table.findById(table);
  if (!t) return res.status(404).json({ success: false, message: "Table not found" });
  if (Number(guests) > t.seats)
    return res.status(400).json({ success: false, message: `This table seats only ${t.seats}` });

  const twoHours = 2 * 60 * 60 * 1000;
  const clash = await Reservation.findOne({
    table,
    status: { $in: ["Pending", "Confirmed"] },
    date: { $gt: new Date(when - twoHours), $lt: new Date(+when + twoHours) },
  });
  if (clash)
    return res.status(409).json({ success: false, message: "Table is already booked around that time" });

  const reservation = await Reservation.create({
    user: req.user._id, table, date: when, guests: Number(guests), specialRequests,
  });
  res.status(201).json({ success: true, reservation });
};

export const getMyReservations = async (req, res) => {
  const reservations = await withDetails(Reservation.find({ user: req.user._id }).sort({ date: -1 }));
  res.json({ success: true, reservations });
};

export const cancelReservation = async (req, res) => {
  const r = await Reservation.findById(req.params.id);
  if (!r || String(r.user) !== String(req.user._id))
    return res.status(404).json({ success: false, message: "Reservation not found" });
  r.status = "Cancelled";
  await r.save();
  res.json({ success: true, reservation: r });
};

export const getAllReservations = async (req, res) => {
  const reservations = await withDetails(Reservation.find().sort({ date: -1 }));
  res.json({ success: true, reservations });
};

export const updateReservationStatus = async (req, res) => {
  const allowed = ["Pending", "Confirmed", "Cancelled", "Completed"];
  if (!allowed.includes(req.body.status))
    return res.status(400).json({ success: false, message: "Invalid status" });
  const r = await Reservation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!r) return res.status(404).json({ success: false, message: "Reservation not found" });
  res.json({ success: true, reservation: r });
};