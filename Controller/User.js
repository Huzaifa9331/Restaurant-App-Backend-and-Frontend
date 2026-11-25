import User from "../Schema/User.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sendAuth = (user, status, res, message) => {
  const token = user.jsonWebToken();
  const u = user.toObject();
  delete u.password; delete u.resetPasswordToken; delete u.resetPasswordExpire;
  res.status(status).json({ success: true, message, token, user: u });
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  if (password.length < 8)
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

  const clean = email.toLowerCase().trim();
  if (await User.findOne({ email: clean }))
    return res.status(409).json({ success: false, message: "Email already registered" });

  // Everyone signs up as Customer. Make a Manager by editing role in Atlas.
  const user = await User.create({ name: name.trim(), email: clean, password, role: "Customer" });
  sendAuth(user, 201, res, "Account created");
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ success: false, message: "Invalid email or password" });

  sendAuth(user, 200, res, "Login successful");
};

export const logOut = async (req, res) => {
  res.json({ success: true, message: "Logged out" });
};

export const updatePassword = async (req, res) => {
  if (String(req.user._id) !== req.params.id)
    return res.status(403).json({ success: false, message: "Not allowed" });
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 8)
    return res.status(400).json({ success: false, message: "Valid old and new (8+ chars) passwords required" });

  const user = await User.findById(req.params.id);
  if (!(await user.comparePassword(oldPassword)))
    return res.status(401).json({ success: false, message: "Old password is incorrect" });

  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
};

export const updateUser = async (req, res) => {
  if (String(req.user._id) !== req.params.id && req.user.role !== "Manager")
    return res.status(403).json({ success: false, message: "Not allowed" });
  const updates = {};
  if (req.body.name) updates.name = req.body.name.trim();
  if (req.body.email) updates.email = req.body.email.toLowerCase().trim();
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
};

export const deleteUser = async (req, res) => {
  if (String(req.user._id) !== req.params.id && req.user.role !== "Manager")
    return res.status(403).json({ success: false, message: "Not allowed" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
};

export const updateProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "restaurant/profiles" }, (e, r) => (e ? reject(e) : resolve(r)));
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImage: { url: result.secure_url, public_id: result.public_id } },
    { new: true }
  ).select("-password");
  res.json({ success: true, user });
};