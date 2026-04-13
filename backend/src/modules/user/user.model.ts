import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: String,
    fullName: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["candidate", "employer", "user", "company"],
      default: "candidate",
    },
    avatar: String,
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  },
);

const AccountUser = mongoose.model("AccountUser", schema, "users");

export default AccountUser;
