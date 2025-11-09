import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Admin schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// Connect
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

async function seed() {
  await mongoose.connect(MONGODB_URI);
  // Delete existing admin
  await Admin.deleteMany({ username: "admin" });
  // Create new admin (pre-save hook will hash the password)
  const admin = new Admin({ username: "admin", password: "admin" });
  await admin.save();
  console.log("Admin created with hashed password: admin / admin");
  process.exit();
}

seed();
