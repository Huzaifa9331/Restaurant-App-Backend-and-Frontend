
import "dotenv/config";
import mongoose from "mongoose";
import connect from "./db.js";
import Menu from "./Schema/Menu.js";

const items = [
  ["Chicken Samosa Chaat", "Crispy samosas with yogurt, chutney and chickpeas.", 450, "Starters", "🥟", true],
  ["Seekh Kebab Bites", "Charcoal-grilled minced beef skewers with mint dip.", 650, "Starters", "🍢", true],
  ["Tomato Basil Soup", "Slow-cooked tomato soup with garlic croutons.", 380, "Starters", "🍅", true],
  ["Crispy Calamari", "Lightly battered squid rings with lemon aioli.", 850, "Starters", "🦑", false],
  ["Chicken Karahi", "Wok-cooked chicken in tomato, ginger and green chilli.", 1400, "Mains", "🍲", true],
  ["Beef Nihari", "Overnight slow-cooked beef shank with naan.", 1600, "Mains", "🥘", true],
  ["Grilled Fish Platter", "Spiced river fish with rice and salad.", 1750, "Mains", "🐟", true],
  ["Paneer Tikka Masala", "Cottage cheese in a creamy tomato gravy.", 1200, "Mains", "🧀", true],
  ["Chicken Biryani", "Aromatic basmati rice layered with spiced chicken.", 1100, "Mains", "🍛", false],
  ["Gulab Jamun", "Warm milk dumplings in rose-cardamom syrup.", 350, "Desserts", "🍮", true],
  ["Kheer", "Creamy rice pudding with pistachios.", 320, "Desserts", "🍚", true],
  ["Chocolate Lava Cake", "Molten chocolate centre with vanilla ice cream.", 550, "Desserts", "🍰", true],
  ["Kulfi Falooda", "Traditional kulfi with vermicelli and rose syrup.", 420, "Desserts", "🍨", true],
  ["Mango Lassi", "Chilled yogurt drink blended with ripe mango.", 300, "Drinks", "🥭", true],
  ["Kashmiri Chai", "Pink tea with almonds and cardamom.", 250, "Drinks", "🍵", true],
  ["Fresh Lime Soda", "Sweet or salted, served over ice.", 220, "Drinks", "🍋", true],
  ["Cold Coffee", "Iced coffee with vanilla cream.", 380, "Drinks", "☕", true],
];

async function seedMenu() {
  try {
    await connect();

    for (const [name, description, price, category, emoji, isAvailable] of items) {
      await Menu.updateOne(
        { name },
        {
          $setOnInsert: {
            name,
            description,
            price,
            category,
            isAvailable,
            image: {
              url: `https://placehold.co/300x300?text=${encodeURIComponent(name)}`,
              public_id: `placeholder-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            },
          },
        },
        { upsert: true }
      );
    }

    console.log("Menu seed complete.");
    console.log("Menu items in database:", await Menu.countDocuments());
    console.log("Note: emoji values are for frontend display, not stored in this schema.");
  } catch (error) {
    console.error("Menu seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedMenu();
