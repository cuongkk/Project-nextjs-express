"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeByUser = exports.companySetInterviewDate = exports.companyChangeStatus = exports.detail = exports.list = exports.apply = void 0;
const applicationService = __importStar(require("./application.service"));
const apply = async (req, res) => {
    try {
        const result = await applicationService.apply(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Gửi đơn ứng tuyển thất bại!" });
    }
};
exports.apply = apply;
const list = async (req, res) => {
    const role = req.user?.role;
    if (role === "user") {
        // FIXED: user only sees their own applications (service filters by userId)
        const result = await applicationService.userList(req);
        res.json(result);
        return;
    }
    if (role === "company") {
        // FIXED: company only sees applications for its own jobs (service filters by companyId)
        const result = await applicationService.companyList(req);
        res.json(result);
        return;
    }
    res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
};
exports.list = list;
const detail = async (req, res) => {
    const role = req.user?.role;
    try {
        if (role === "user") {
            // FIXED: user can only view their own application (service enforces userId)
            const result = await applicationService.userDetail(req);
            res.json(result);
            return;
        }
        if (role === "company") {
            // FIXED: company can only view applications that belong to its jobs (service enforces companyId)
            const result = await applicationService.companyDetail(req);
            res.json(result);
            return;
        }
        res.status(403).json({ code: "error", message: "Không có quyền truy cập!" });
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.detail = detail;
const companyChangeStatus = async (req, res) => {
    try {
        const result = await applicationService.companyChangeStatus(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.companyChangeStatus = companyChangeStatus;
const companySetInterviewDate = async (req, res) => {
    try {
        const result = await applicationService.companySetInterviewDate(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.companySetInterviewDate = companySetInterviewDate;
const removeByUser = async (req, res) => {
    try {
        const result = await applicationService.removeByUser(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.removeByUser = removeByUser;
