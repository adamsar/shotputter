import {ErrorResponse} from "./response-errors";

export type HttpResponse = {
    file: Buffer;
    statusCode: 200;
} | {
    body: object;
    statusCode: 200;
} | {
    statusCode: 202 | 201 | 500 | 400;
    body: object;
} | {
    statusCode: 204 | 404
} | "next"

export const NotFound: HttpResponse = {
    statusCode: 404
};

export const NoContent: HttpResponse = {
    statusCode: 204
};

export const Ok = (body: object): HttpResponse => ({
    body,
    statusCode: 200
});

export const OkFile = (file: Buffer): HttpResponse => ({
    file,
    statusCode: 200
})

export const Accepted = (body: object): HttpResponse => ({
    body,
    statusCode: 202
});

export const Created = (body: object): HttpResponse => ({
    body,
    statusCode: 201
});

export const ServerError = (body: object) : HttpResponse=> ({
    body,
    statusCode: 500
});

export const BadResponse = (body: ErrorResponse): HttpResponse => ({
    body,
    statusCode: 400
});
