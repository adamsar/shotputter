import {Request} from "express";
import { validationResult } from "express-validator";
import {EitherAsync, Left, Right} from "purify-ts";
import {BadResponse, HttpResponse} from "./responses";

export type ErrorResponse = {
    error: "server",
    message: string;
} | {
    error: "form",
    fields: {
        name: string;
        reason: string;
    }[];
} | {
    error: "conflict",
    field: string;
};

export const expressValidateToErrorResponse = <A>(req: Request): EitherAsync<HttpResponse, A> => EitherAsync(({liftEither }) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorResponse: ErrorResponse = {
            error: "form",
            fields: errors.array().map(({param, msg}) => ({name: param, reason: msg}))
        };
        return liftEither(Left(BadResponse(errorResponse)))
    }
    return liftEither(Right(req.body));
});