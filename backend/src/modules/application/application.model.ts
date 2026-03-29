import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: String,
    companyId: String,
    jobId: String,
    cvId: String,
    // FIXED: Expanded application status lifecycle
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "accepted"],
      default: "pending",
    },
    viewedByCompany: {
      type: Boolean,
      default: false,
    },
    // ADDED: History of status changes
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
