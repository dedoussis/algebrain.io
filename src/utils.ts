import { List } from 'immutable';

export enum Agent {
    Algebrain = '🧠',
    Me = '🙂',
}

export type Entry = {
    timestamp: string;
    agent: Agent;
    text: string;
};

const generateEntry = (agent: Agent) => (text: string) => {
    return {
        timestamp: new Date().toLocaleTimeString(),
        agent: agent,
        text: text,
    };
};

export const generateAlgebrainEntry: (text: string) => Entry = generateEntry(
    Agent.Algebrain
);
export const generateUserEntry: (text: string) => Entry = generateEntry(
    Agent.Me
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
