import dotenv from "dotenv";
import User from "../models/user.model.js";
import connectDB from "../configs/database.config.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const email = process.env.INITIAL_ADMIN_EMAIL;
    const password = process.env.INITIAL_ADMIN_PASSWORD;

    if (!email || !password) {
      console.error(
        "Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD before running this script.",
      );
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    await User.create({ email, password });
    console.log(`Admin created for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
