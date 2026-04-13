"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
// ADDED: Prevent duplicate applications per user/job
schema.index({ userId: 1, jobId: 1 }, { unique: true });
const Application = mongoose_1.default.model("Application", schema, "applications");
exports.default = Application;
