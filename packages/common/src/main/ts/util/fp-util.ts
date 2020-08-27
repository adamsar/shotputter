import {getTaskValidation, mapLeft, TaskEither, left as taskEitherLeft, right as taskEitherRight} from "fp-ts/lib/TaskEither";
import {Either, isLeft, left, right} from "fp-ts/lib/Either";
import {getMonoid} from "fp-ts/lib/Array";

export const promiseToTaskEither = <A>(promise: Promise<A>): TaskEither<string, A> => {
    return () => promise.then(right).catch(x => {
        return left(String(x));
    });
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
    toDeferFn,
    left: taskEitherLeft,
    right: taskEitherRight,
    errorValidation: getTaskValidation(getMonoid<any>()),
    mapLeftValidation: <A>() => mapLeft((input: A) => [input]),
    mapLeftString: mapLeft((x:any) => x.toString())
}

export const eitherExtensions = {
    left,
    right,
    merge: <A>(eitherInstance: Either<A, A>): A => {
        if (isLeft(eitherInstance)) {
            return eitherInstance.left;
        } else {
            return eitherInstance.right;
        }
    }
}
