import { Router } from "express";
import * as cityController from "./city.controller";

const router = Router();

router.get("/list", cityController.list);

export default router;
