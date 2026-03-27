import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: String,
    companyId: String,
    jobId: String,
    cvId: String,
    status: {
      type: String,
      default: "initial",
    },
    viewedByCompany: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", schema, "applications");

export default Application;
