"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
// ADDED: Prevent duplicate applications per user/job
schema.index({ userId: 1, jobId: 1 }, { unique: true });
const Application = mongoose_1.default.model("Application", schema, "applications");
exports.default = Application;
