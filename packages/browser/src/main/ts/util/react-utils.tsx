/*import * as React from "react";

interface Pending {
    type: "pending";
}

interface Fail<A> {
    type: "error",
    error: A
}

interface Result<A> {
    type: "result",
    result: A
}

interface Empty {
    type: "empty"
}

export function empty<A, B>(): Pot<A, B> { return { type: "empty" }}
export function pending<A, B>(): Pot<A, B> { return { type: "pending" }}
export function

export type Pot<A, B> = Pending | Fail<A> | Result<B> | Empty;

export const usePot = <A, B>() => {
    const [pot, setPot] = React.useState()
}
*/
