import {TaskEither} from "fp-ts/lib/TaskEither";
import {isLeft, left, right} from "fp-ts/lib/Either";

export const promiseToTaskEither = <A>(promise: Promise<A>): TaskEither<string, A> => {
    return () => promise.then(right).catch(left);
}

const toDeferFn = <A, B>(taskEither: TaskEither<A, B>): () => Promise<B> => {
    return () => taskEither().then((result) => new Promise((resolve, reject) => {
        if (isLeft(result)) {
            reject(result.left)
        } else {
            resolve(result.right)
        }
    }));
}

export const taskEitherExtensions = {
    fromPromise: promiseToTaskEither,
    toDeferFn
}

export const eitherExtensions = {
    left,
    right
}
