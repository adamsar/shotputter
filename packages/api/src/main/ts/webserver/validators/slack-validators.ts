import { check } from "express-validator";
import {optional} from "./validator-util";

export const channelValidator = optional(check("channels"));
export const channelSingleValidator = optional(check("channel"))
