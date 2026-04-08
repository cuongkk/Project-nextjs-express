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
exports.detail = exports.list = exports.deleteJobDel = exports.editJobPatch = exports.editJob = exports.listJob = exports.createJobPost = exports.profilePatch = void 0;
const companyService = __importStar(require("./company.service"));
const profilePatch = async (req, res) => {
    try {
        const result = await companyService.profilePatch(req);
        res.json(result);
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Cập nhật không thành công!",
        });
    }
};
exports.profilePatch = profilePatch;
const createJobPost = async (req, res) => {
    try {
        const result = await companyService.createJobPost(req);
        res.json(result);
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Dữ liệu không hợp lệ!",
        });
    }
};
exports.createJobPost = createJobPost;
const listJob = async (req, res) => {
    const result = await companyService.listJob(req);
    res.json(result);
};
exports.listJob = listJob;
const editJob = async (req, res) => {
    const result = await companyService.editJob(req);
    res.json(result);
};
exports.editJob = editJob;
const editJobPatch = async (req, res) => {
    const result = await companyService.editJobPatch(req);
    res.json(result);
};
exports.editJobPatch = editJobPatch;
const deleteJobDel = async (req, res) => {
    const result = await companyService.deleteJobDel(req);
    res.json(result);
};
exports.deleteJobDel = deleteJobDel;
const list = async (req, res) => {
    const result = await companyService.list(req);
    res.json(result);
};
exports.list = list;
const detail = async (req, res) => {
    try {
        const result = await companyService.detail(req);
        res.json(result);
    }
    catch (error) {
        res.json({
            code: "error",
            message: "Thất bại!",
        });
    }
};
exports.detail = detail;
