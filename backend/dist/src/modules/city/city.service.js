"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const city_model_1 = __importDefault(require("./city.model"));
const list = async () => {
    const cityList = await city_model_1.default.find({});
    return {
        code: "success",
        message: "Thành công!",
        cityList,
    };
};
exports.list = list;
