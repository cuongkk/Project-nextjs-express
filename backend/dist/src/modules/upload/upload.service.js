"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = async (filePath) => {
    return {
        code: "success",
        url: filePath || null,
    };
};
exports.uploadImage = uploadImage;
