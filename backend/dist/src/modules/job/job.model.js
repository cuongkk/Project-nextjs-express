"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    companyId: String,
    createdBy: String,
    title: String,
    companyName: String,
    location: String,
    type: {
        type: String,
        enum: ["remote", "onsite", "hybrid", "full-time", "part-time"],
        default: "onsite",
    },
    level: {
        type: String,
        enum: ["intern", "junior", "middle", "senior", "fresher", "manager"],
        default: "junior",
    },
    salaryMin: Number,
    salaryMax: Number,
    position: String,
    workingForm: String,
    techStack: [String],
    technologies: Array,
    description: String,
    requirements: String,
    benefits: String,
    images: Array,
    city: String,
    status: {
        type: String,
        enum: ["active", "open", "closed", "expired"],
        default: "open",
    },
    expiresAt: Date,
}, {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
});
schema.index({ title: "text", description: "text", requirements: "text", companyName: "text", location: "text" });
schema.index({ companyId: 1, createdAt: -1 });
schema.index({ status: 1, expiresAt: 1 });
const Job = mongoose_1.default.model("Job", schema, "jobs");
exports.default = Job;
