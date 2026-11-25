import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
console.log("URI loaded:", uri ? "YES" : "NO");

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ Connected to:", mongoose.connection.host);
  process.exit(0);
} catch (err) {
  console.error("❌ Failed:", err.message);
  process.exit(1);
}