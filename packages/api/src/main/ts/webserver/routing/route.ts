import {NextFunction, Request, RequestHandler, Response} from "express";
import {EitherAsync} from "purify-ts";
import {HttpResponse} from "./responses";
import {TaskEither} from "fp-ts/lib/TaskEither";
import {eitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";

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

export const _route = (fn: (options: {req: Request, res: Response}) => TaskEither<HttpResponse, HttpResponse>): RequestHandler => {
    return async (_req: Request, _res: Response, _next: NextFunction) => {
        try {
            const result = eitherExtensions.merge(await fn({req: _req, res: _res})())
            const parseResult = (response: HttpResponse) => {
                if (response === "next") {
                    _next()
                } else if ("body" in response) {
                    _res.status(response.statusCode).send(response.body);
                } else if ("file" in response) {
                    _res.writeHead(200, {'Content-Type': 'image/png'});
                    _res.end(response.file);
                } else {
                    _res.sendStatus(response.statusCode);
                }
            };
            parseResult(result);
        } catch (error) {
            _res.status(500).send({error: "server", message: error})
        }
    }
}
