import {Request} from "express";
import { validationResult } from "express-validator";
import {EitherAsync, Left, Right} from "purify-ts";
import {BadResponse, HttpResponse} from "./responses";
import * as t from "@shotputter/common/node_modules/io-ts";

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

export const decoderErrortoErrorResponse = (errors: t.Errors): ErrorResponse => {
    return {
        error: "form",
        fields: errors.map(error => {
            const name = error.context.slice(1).map(x => x.key).join("\n");
            const reason = error.message || "INVALID";
            return {name, reason}
        })
    }
}

export const BadDecodeResponse = (errors: t.Errors) => BadResponse(decoderErrortoErrorResponse(errors))

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
