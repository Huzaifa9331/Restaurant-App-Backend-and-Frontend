import Table from "../Schema/Table.js";

export const getTables = async (req, res) => {
  const tables = await Table.find().sort({ tableNumber: 1 });
  res.json({ success: true, tables });
};

export const createTable = async (req, res) => {
  const table = await Table.create({ tableNumber: req.body.tableNumber, seats: req.body.seats });
  res.status(201).json({ success: true, table });
};

export const deleteTable = async (req, res) => {
  await Table.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Table deleted" });
};