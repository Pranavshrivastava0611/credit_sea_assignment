import mongoose from "mongoose";
import { User } from "../models/User.model";
import dotenv from "dotenv";

dotenv.config();

const SEED_USERS = [
  { name: "Admin User", email: "admin@lms.com", password: "Admin@123", role: "Admin" },
  { name: "Sales Executive", email: "sales@lms.com", password: "Sales@123", role: "Sales" },
  { name: "Sanction Officer", email: "sanction@lms.com", password: "Sanction@123", role: "Sanction" },
  { name: "Disbursal Officer", email: "disburse@lms.com", password: "Disburse@123", role: "Disbursement" },
  { name: "Collection Agent", email: "collection@lms.com", password: "Collect@123", role: "Collection" },
  { name: "Test Borrower", email: "borrower@lms.com", password: "Borrower@123", role: "Borrower" },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("❌ MONGODB_URI not set in .env");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Remove existing seed users
    await User.deleteMany({ email: { $in: SEED_USERS.map((u) => u.email) } });
    console.log("🗑️  Cleared existing seed users");

    // Create users one by one so pre-save hook runs for password hashing
    for (const userData of SEED_USERS) {
      const user = new User(userData);
      await user.save();
    }

    console.log("\n✅ Seed complete. Accounts created:\n");
    console.log("┌──────────────┬────────────────────────┬───────────────┐");
    console.log("│ Role         │ Email                  │ Password      │");
    console.log("├──────────────┼────────────────────────┼───────────────┤");
    SEED_USERS.forEach((u) => {
      console.log(
        `│ ${u.role.padEnd(12)} │ ${u.email.padEnd(22)} │ ${u.password.padEnd(13)} │`
      );
    });
    console.log("└──────────────┴────────────────────────┴───────────────┘");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
