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
