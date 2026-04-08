import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: String,
    companyId: String,
    jobId: String,
    cvId: String,
    status: {
      type: String,
      enum: ["pending", "viewed", "rejected", "accepted"],
      default: "pending",
    },
    viewedByCompany: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        status: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// ADDED: Prevent duplicate applications per user/job
schema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model("Application", schema, "applications");

export default Application;
