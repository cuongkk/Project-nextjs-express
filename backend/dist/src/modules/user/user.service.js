"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profilePatch = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const profilePatch = async (req) => {
    if (req.file) {
        req.body.avatar = req.file.path;
    }
    else {
        delete req.body.avatar;
    }
    await user_model_1.default.updateOne({
        _id: req.account.id,
    }, req.body);
    return {
        code: "success",
        message: "Cập nhật thành công!",
    };
};
exports.profilePatch = profilePatch;
