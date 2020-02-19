import {NextFunction, Request, RequestHandler, Response} from "express";
import {EitherAsync} from "purify-ts";
import {HttpResponse} from "./responses";

export const route = (fn: (options: {req: Request, res: Response}) => EitherAsync<HttpResponse, HttpResponse>): RequestHandler => {
    return async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            const result = await fn({req: _req, res: _res}).run();
            const parseResult = (response: HttpResponse) => {
                if (response === "next") {
                    _next()
                } else if ("body" in response) {
                    _res.status(response.statusCode).send(response.body);
                } else {
                    _res.sendStatus(response.statusCode);
                }
            };
            result.bimap(parseResult, parseResult);
        } catch (error) {
            _res.status(500).send({ error: "server", message: error });
            return;
        }
    }
};