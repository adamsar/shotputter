import * as t from "io-ts";
import {fromEither, TaskEither} from "fp-ts/lib/TaskEither";
import {mapLeft} from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";

export const ioUtils = {
    toTaskEither: <A, B>(obj: unknown, _type: t.Type<A>, onFailure: (errors: t.Errors) => B): TaskEither<B, A> => {
        return fromEither(pipe(
            _type.decode(obj),
            mapLeft(onFailure)
        ))
    }
};
