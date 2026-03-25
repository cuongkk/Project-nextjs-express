import { Request, Response } from "express";
import * as searchService from "./search.service";

export const search = async (req: Request, res: Response) => {
  const result = await searchService.search(req.query);
  res.json(result);
};
