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
exports.remove = exports.update = exports.create = exports.detailUser = exports.listUser = void 0;
const cvService = __importStar(require("./cv.service"));
const listUser = async (req, res) => {
    try {
        const result = await cvService.listForUser(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.listUser = listUser;
const detailUser = async (req, res) => {
    try {
        const result = await cvService.detailForUser(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Thất bại!" });
    }
};
exports.detailUser = detailUser;
const create = async (req, res) => {
    try {
        const result = await cvService.create(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Tạo CV thất bại!" });
    }
};
exports.create = create;
const update = async (req, res) => {
    try {
        const result = await cvService.update(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Cập nhật CV thất bại!" });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        const result = await cvService.remove(req);
        res.json(result);
    }
    catch (error) {
        res.json({ code: "error", message: "Xóa CV thất bại!" });
    }
};
exports.remove = remove;
