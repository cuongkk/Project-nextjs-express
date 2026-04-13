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
exports.recommend = exports.remove = exports.update = exports.create = exports.detail = exports.publicList = exports.list = exports.all = void 0;
const jobService = __importStar(require("./job.service"));
const all = async (req, res) => {
    const result = await jobService.all();
    res.json(result);
};
exports.all = all;
const list = async (req, res) => {
    if (!req.account) {
        return res.status(401).json({
            code: "error",
            message: "Unauthorized",
        });
    }
    const result = await jobService.list(req.account.id);
    res.json(result);
};
exports.list = list;
const publicList = async (req, res) => {
    const result = await jobService.publicList(req.query);
    res.json(result);
};
exports.publicList = publicList;
const detail = async (req, res) => {
    const id = req.params.id;
    const result = await jobService.detail(id);
    res.json(result);
};
exports.detail = detail;
const create = async (req, res) => {
    try {
        const result = await jobService.create(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Dữ liệu không hợp lệ!" });
    }
};
exports.create = create;
const update = async (req, res) => {
    try {
        const result = await jobService.update(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Cập nhật không thành công!" });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        const result = await jobService.remove(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.remove = remove;
// ADDED: Recommend jobs for candidate (user role)
const recommend = async (req, res) => {
    try {
        const result = await jobService.recommend(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Lấy danh sách gợi ý thất bại!" });
    }
};
exports.recommend = recommend;
// Nộp CV đã được tách sang modules/cv/cv.controller
