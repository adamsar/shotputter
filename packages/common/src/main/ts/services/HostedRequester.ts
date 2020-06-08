import {chain, fold, map, mapLeft, right, TaskEither, tryCatch} from "fp-ts/lib/TaskEither";
import {pipe} from "fp-ts/lib/pipeable";
import {eitherExtensions, promiseToTaskEither, taskEitherExtensions} from "../util/fp-util";
import {task, map as taskMap} from "fp-ts/lib/Task";

const FormData = window?.FormData ?? require("form-data");

export type HttpError = {type: "httpError"} & ({errorStatus: number; details: string} | {error: string;});
const mapError = mapLeft<string, HttpError>(error => ({error, type: "httpError"}));

export function getRequest<A>(path: string, headers?: object): TaskEither<HttpError, A> {
    return pipe(
        promiseToTaskEither(
            fetch(path, {method: 'GET', headers: {...(headers ?? {})}})
        ),
        mapError,
        chain((response: Response) => {
            if (response.status >= 400) {
                console.log(response);
                return pipe(
                    taskEitherExtensions.fromPromise(response.text()),
                    map((details: string): HttpError => ({type: "httpError", details, errorStatus: response.status})),
                    mapError,
                    fold(task.of, x => task.of(x)),
                    taskMap(x => eitherExtensions.left(x))
                );
***REMOVED*** else {
                return right(response)
***REMOVED***
        }),
        chain(response => pipe(taskEitherExtensions.fromPromise<A>(response.json()), mapError)),
    );
}

export function postRequest<A>(path: string, body?: object | FormData, headers?: object): TaskEither<HttpError, A> {
    return pipe(
        doPostRequest(path, body, headers),
        chain(body => tryCatch(() => body.json(), error => ({type: "httpError", error: String(error)})))
    );
}

export function doPostRequest(path: string, body?: object | FormData, headers?: object): TaskEither<HttpError, Response> {
    return pipe(
        promiseToTaskEither(
            fetch(path, {
                method: 'POST',
                // @ts-ignore
                body: body ?
                    body instanceof FormData ? body : JSON.stringify(body) : undefined,
                headers: {
                    ...(headers ?? {}),
                    // @ts-ignore
                    "Content-Type": body instanceof FormData ? "multipart/form-data" : "application/json"
    ***REMOVED***
***REMOVED***)),
        mapError,
        chain((response: Response) => {
            if (response.status >= 400) {
                console.log(response);
                return pipe(
                    taskEitherExtensions.fromPromise(response.text()),
                    map((details: string): HttpError => ({type: "httpError", details, errorStatus: response.status})),
                    mapError,
                    fold(task.of, x => task.of(x)),
                    taskMap(x => eitherExtensions.left(x))
                );
***REMOVED*** else {
                return right(response)
***REMOVED***
        })
    );
}

export class HostedRequester {

    constructor(private baseUrl: string) {

    }

    get<A>(path: string): TaskEither<HttpError, A> {
        console.log(this);
        return getRequest(`${this.baseUrl}${path}`);
    }

    post<A>(path: string, body?: object): TaskEither<HttpError, A> {
        return postRequest(`${this.baseUrl}${path}`, body);
    }

}
