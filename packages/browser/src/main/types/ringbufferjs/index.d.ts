declare module "ringbufferjs" {
    declare class RingBuffer<A> {
        constructor(numberOfElements?: number, evictedCb?: (element: A) => void);

        capacity(): number;

        deq(): A; // Throws error if no elements left
        deqN(count: number): A[]; // Throws error
        enq(element: A): void;
        isEmpty(): boolean;
        peek(): A;
        peekN(count: number): A[];
        size(): number;
    }

    export default RingBuffer;
}
