"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.detailForUser = exports.listForUser = void 0;
const cv_model_1 = __importDefault(require("./cv.model"));
const variable_config_1 = require("../../configs/variable.config");
// User: list own CVs
const listForUser = async (req) => {
    const userEmail = req.account.email;
    const find = {
        email: userEmail,
    };
    const limitItems = variable_config_1.PAGINATION.USER_CV_PAGE_SIZE;
    let page = 1;
    if (req.query.page) {
        page = parseInt(`${req.query.page}`);
    }
    const totalRecord = await cv_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(totalRecord / limitItems) || 1;
    const skip = (page - 1) * limitItems;
    const listCV = await cv_model_1.default.find(find)
        .sort({
        createdAt: "desc",
    })
        .limit(limitItems)
        .skip(skip);
    return {
        code: "success",
        message: "Lấy danh sách CV thành công!",
        listCV,
        totalPage,
    };
};
exports.listForUser = listForUser;
// User: view single CV
const detailForUser = async (req) => {
    const userEmail = req.account.email;
    const id = req.params.id;
    const cv = await cv_model_1.default.findOne({ _id: id, email: userEmail });
    if (!cv) {
        return { code: "error", message: "Không tìm thấy CV!" };
    }
    return {
        code: "success",
        message: "Thành công!",
        cv,
    };
};
exports.detailForUser = detailForUser;
// User: create a CV
const create = async (req) => {
    const filePath = req.file ? req.file.path : req.body.fileCV || "";
    const cv = await cv_model_1.default.create({
        email: req.account?.email ?? req.body.email,
        userName: req.body.userName,
        phone: req.body.phone,
        fileCV: filePath,
    });
    return {
        code: "success",
        message: "Tạo CV thành công!",
        cv,
    };
};
exports.create = create;
// User: update a CV
const update = async (req) => {
    const userEmail = req.account?.email;
    const id = req.params.id;
    const cv = await cv_model_1.default.findOne({ _id: id, email: userEmail });
    if (!cv) {
        return { code: "error", message: "Không tìm thấy CV!" };
    }
    const filePath = req.file ? req.file.path : req.body.fileCV || cv.fileCV;
    cv.userName = req.body.userName ?? cv.userName;
    cv.phone = req.body.phone ?? cv.phone;
    cv.fileCV = filePath;
    await cv.save();
    return {
        code: "success",
        message: "Cập nhật CV thành công!",
        cv,
    };
};
exports.update = update;
// User: delete a CV
const remove = async (req) => {
    const userEmail = req.account.email;
    const id = req.params.id;
    const cv = await cv_model_1.default.findOne({ _id: id, email: userEmail });
    if (!cv) {
        return { code: "error", message: "Không tìm thấy CV!" };
    }
    await cv_model_1.default.deleteOne({ _id: id, email: userEmail });
    return {
        code: "success",
        message: "Đã xóa CV!",
    };
};
exports.remove = remove;
