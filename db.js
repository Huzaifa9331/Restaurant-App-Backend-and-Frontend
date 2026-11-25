// import dns from "node:dns";
// import mongoose from "mongoose";

// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
//     console.log("MongoDB connected:", mongoose.connection.name);
//   } catch (err) {
//     console.error("MongoDB connection failed:", err.message);
//     process.exit(1);
//   }
// };

// export default connect;


// db.js


// db.js
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);   // fixes the querySrv error

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;