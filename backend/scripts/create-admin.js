import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";

dotenv.config({ path: "../.env" });

const run = async () => {
  const email = process.env.INIT_ADMIN_EMAIL || "admin@portfolio.local";
  const password = process.env.INIT_ADMIN_PASSWORD || "admin12345";

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists");
    await mongoose.disconnect();
    return;
  }

  await User.create({ email, password });
  console.log(`Admin created: ${email}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
