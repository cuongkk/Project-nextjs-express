"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isCompany = exports.isUser = void 0;
const isUser = (req, res, next) => {
    if (req.user?.role !== "user") {
        res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
        return;
    }
    next();
};
exports.isUser = isUser;
const isCompany = (req, res, next) => {
    if (req.user?.role !== "company") {
        res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
        return;
    }
    next();
};
exports.isCompany = isCompany;
const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
