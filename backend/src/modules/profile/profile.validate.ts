import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const patchMe = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().max(100).optional(),
    skills: Joi.alternatives()
      .try(Joi.array().items(Joi.string().max(50)), Joi.string())
      .optional(),
    experienceYears: Joi.number().min(0).max(80).optional(),
    education: Joi.string().allow("", null).max(500).optional(),
    resumeUrl: Joi.string().allow("", null).optional(),
    bio: Joi.string().allow("", null).max(2000).optional(),
    expectedSalaryMin: Joi.number().min(0).optional(),
    expectedSalaryMax: Joi.number().min(0).optional(),
    location: Joi.string().allow("", null).max(200).optional(),
    isPublic: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  }).unknown(true);

  const { error } = schema.validate(req.body);
  if (error) {
    res.json({ code: "error", message: error.details[0].message });
    return;
  }

  next();
};
