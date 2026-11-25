import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./db.js";
import Menu from "./Schema/Menu.js";
import Table from "./Schema/Table.js";

const menu = [
  { name: "Chicken Karahi", description: "Spicy wok-cooked chicken", price: 1800, category: "Mains" },
  { name: "Beef Burger", description: "Juicy patty with cheese", price: 900, category: "Mains" },
  { name: "Chicken Tikka", description: "Charcoal grilled", price: 1100, category: "Mains" },
  { name: "Spring Rolls", description: "Crispy veg rolls", price: 450, category: "Starters" },
  { name: "Soup of the Day", description: "Hot and fresh", price: 350, category: "Starters" },
  { name: "Chocolate Cake", description: "Rich chocolate slice", price: 500, category: "Desserts" },
  { name: "Ice Cream", description: "Two scoops", price: 300, category: "Desserts" },
  { name: "Fresh Lime", description: "Chilled", price: 200, category: "Drinks" },
  { name: "Cold Drink", description: "500ml", price: 150, category: "Drinks" },
  { name: "French Fries", description: "Salted fries", price: 300, category: "Sides" },
];

await connectDB();
for (const m of menu) await Menu.updateOne({ name: m.name }, { $setOnInsert: m }, { upsert: true });
for (let n = 1; n <= 6; n++) await Table.updateOne({ tableNumber: n }, { $setOnInsert: { tableNumber: n, seats: n <= 3 ? 2 : 4 } }, { upsert: true });
console.log("Seed complete");
await mongoose.disconnect();