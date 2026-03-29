import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    companyId: String,
    title: String,
    salaryMin: Number,
    salaryMax: Number,
    position: String,
    workingForm: String,
    technologies: Array,
    description: String,
    images: Array,
    city: String,
    // ADDED: Job lifecycle fields
    status: {
      type: String,
      enum: ["active", "closed", "expired"],
      default: "active",
    },
    expiresAt: Date,
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  },
);

const Job = mongoose.model("Job", schema, "jobs");

export default Job;
