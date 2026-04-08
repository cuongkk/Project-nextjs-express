"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    userId: String,
    jobId: String,
    companyId: String,
}, {
    timestamps: true,
});
const SavedJob = mongoose_1.default.model("SavedJob", schema, "saved-jobs");
exports.default = SavedJob;
