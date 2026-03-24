import { Request, Response } from "express";
import * as jobService from "./job.service";

export const detail = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await jobService.detail(id);
  res.json(result);
};

// Nộp CV đã được tách sang modules/cv/cv.controller
