import {check} from "express-validator";

export const messageValidator = check("message").trim();
export const imageValidator = check("image").trim().notEmpty();
