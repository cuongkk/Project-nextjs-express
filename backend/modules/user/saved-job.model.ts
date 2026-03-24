import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: String,
    jobId: String,
    companyId: String,
  },
  {
    timestamps: true,
  },
);

const SavedJob = mongoose.model("SavedJob", schema, "saved-jobs");

export default SavedJob;
