import * as t from "io-ts";
import {fromEither, TaskEither} from "fp-ts/lib/TaskEither";
import {mapLeft} from "fp-ts/lib/Either";
import {pipe} from "fp-ts/lib/pipeable";
import {withMessage} from "io-ts-types/lib/withMessage";

export const ioUtils = {
    toTaskEither: <A, B>(obj: unknown, _type: t.Type<A>, onFailure: (errors: t.Errors) => B): TaskEither<B, A> => {
        return fromEither(pipe(
            _type.decode(obj),
            mapLeft(onFailure)
        ))
    },
    toErrorObject: mapLeft((errors: t.Errors) => {
        const obj: {[key: string]: string;} = {};
        errors.forEach(error => {
            obj[error.context
                .filter(x => x.key)
                .map(x => x.key).join(".")] = error.message
        })
        return obj;
    })
};


export const withRequired = <T>(_type: t.Type<T>): t.Type<T> => {
    return withMessage(
        _type,
        (input: unknown, _) => {
            if (!input) return "required"
            else return "string_required"
        }
    )
}

