import { List } from 'immutable';

export enum Stream {
    Input = 'IN',
    Output = 'OUT',
}

export type Entry = {
    timestamp: string;
    stream: Stream;
    text: string;
};

const generateEntry = (stream: Stream) => (text: string) => {
    return {
        timestamp: new Date().toLocaleTimeString(),
        stream: stream,
        text: text,
    };
};

export const generateInputEntry: (text: string) => Entry = generateEntry(
    Stream.Input
);
export const generateOutputEntry: (text: string) => Entry = generateEntry(
    Stream.Output
);

export type LinkedItem<T> = {
    value: T;
    next?: LinkedItem<T>;
    previous?: LinkedItem<T>;
};

export class LinkedList<T> {
    constructor(public head?: LinkedItem<T>) {}

    prepend(item: T): LinkedList<T> {
        if (!this.head) {
            return new LinkedList({ value: item });
        }
        const newHead: LinkedItem<T> = {
            value: item,
            next: this.head,
        };
        this.head.previous = newHead;
        return new LinkedList(newHead);
    }

    static fromList<T>(list: List<T>): LinkedList<T> {
        return list.reduce(
            (linked: LinkedList<T>, item: T) => linked.prepend(item),
            new LinkedList()
        );
    }
}
