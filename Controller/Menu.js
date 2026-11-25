import Menu from "../Schema/Menu.js";

export const getMenu = async (req, res) => {
  const filter = { isAvailable: true };
  if (req.query.category) filter.category = req.query.category;
  const items = await Menu.find(filter).sort({ category: 1, name: 1 });
  res.json({ success: true, items });
};

export const createItem = async (req, res) => {
  const { name, description, price, category, image } = req.body;
  const item = await Menu.create({ name, description, price, category, image: { url: image || "", public_id: "" } });
  res.status(201).json({ success: true, item });
};

export const updateItem = async (req, res) => {
  const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  res.json({ success: true, item });
};

export const deleteItem = async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Item deleted" });
};