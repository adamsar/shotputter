import {check} from "express-validator";
import {optional} from "./validator-util";

export const titleValidator = check("title").trim().notEmpty();
export const labelsValidator = check("labels").isArray();
export const ownerValidator = optional(check("owner").trim());
export const repoValidator = optional(check("repo").trim());

