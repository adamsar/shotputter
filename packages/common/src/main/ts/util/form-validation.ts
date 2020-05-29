import {Either, mapLeft} from "fp-ts/lib/Either";
import * as t from "io-ts";
import {Errors} from "io-ts";
import {pipe} from "fp-ts/lib/pipeable";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import first from "lodash/first";

export interface ShotputFormError {
    [key: string]: string;
}

export type ValidatedForm<A> = Either<ShotputFormError, A>

/**
 * Validates a form/input with an encoder (io-ts t.Type). Outputs a validated form.
 * @param validator -
 * @param input
 */
export function decodeForm<A>(validator: t.Type<A, A>, input: Partial<A>): ValidatedForm<A> {
    return pipe(
        validator.decode(input),
        mapLeft(
            (errors: Errors) => map(
                    groupBy(
                        errors.map(error => ({
                            key: error.context.map(x => x.key).filter(x => Boolean(x) && isNaN(parseFloat(x))).join("."),
                            reason: error.message
            ***REMOVED***)),
                        x => x.key
                    ), (value, key) => ({key, value:  first(value).reason}))
                    .reduceRight((errors, nextError) => ({...errors, [nextError.key]: nextError.value}), {})
        )
    )
}
