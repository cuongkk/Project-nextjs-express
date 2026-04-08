import { Router } from "express";
import * as cityController from "./city.controller";

const router = Router();

router.get("/", cityController.list);

export default router;
