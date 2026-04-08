"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const company_route_1 = __importDefault(require("../modules/company/company.route"));
const city_route_1 = __importDefault(require("../modules/city/city.route"));
const upload_route_1 = __importDefault(require("../modules/upload/upload.route"));
const job_route_1 = __importDefault(require("../modules/job/job.route"));
const cv_route_1 = __importDefault(require("../modules/cv/cv.route"));
const application_route_1 = __importDefault(require("../modules/application/application.route"));
const search_route_1 = __importDefault(require("../modules/search/search.route"));
const notification_route_1 = __importDefault(require("../modules/notificaion/notification.route")); // ADDED
const router = (0, express_1.Router)();
router.use("/users", user_route_1.default);
router.use("/auth", auth_route_1.default);
router.use("/companies", company_route_1.default);
router.use("/cities", city_route_1.default);
router.use("/uploads", upload_route_1.default);
router.use("/jobs", job_route_1.default);
router.use("/cvs", cv_route_1.default);
router.use("/applications", application_route_1.default);
router.use("/search", search_route_1.default);
router.use("/notifications", notification_route_1.default); // ADDED
exports.default = router;
