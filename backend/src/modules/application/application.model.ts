import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: String,
    candidateId: String,
    companyId: String,
    jobId: String,
    cvId: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ["applied", "screening", "interview", "offer", "hired", "rejected", "pending", "viewed", "accepted"],
      default: "applied",
    },
    interviewDate: Date,
    note: String,
    viewedByCompany: {
      type: Boolean,
      default: false,
    },
    history: [
      {
        status: String,
        updatedAt: Date,
        note: String,
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
