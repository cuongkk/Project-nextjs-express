import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    education: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    expectedSalaryMin: {
      type: Number,
      default: 0,
    },
    expectedSalaryMax: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const CandidateProfile = mongoose.model("CandidateProfile", schema, "user-profiles");

export default CandidateProfile;
