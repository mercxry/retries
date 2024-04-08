export interface Variables {
    base: VariableContent;
    minSleep: VariableContent;
    maxSleep: VariableContent;
    minJitterFactor: VariableContent;
    maxJitterFactor: VariableContent;
    maxAttempts: VariableContent;
}

export enum VariableKind {
    Number = "number",
    Duration = "duration",
    Float = "float",
}

export interface VariableContent {
    kind: VariableKind;
    value: number;
}

export const defaultVariables: Variables = {
    base: {
        kind: VariableKind.Number,
        value: 2,
    },
    minSleep: {
        kind: VariableKind.Duration,
        value: 1000, // 1000ms = 1s
    },
    maxSleep: {
        kind: VariableKind.Duration,
        value: 1800000, // 1800000ms = 30m
    },
    minJitterFactor: {
        kind: VariableKind.Float,
        value: 0.0,
    },
    maxJitterFactor: {
        kind: VariableKind.Float,
        value: 1.0,
    },
    maxAttempts: {
        kind: VariableKind.Number,
        value: 10
    },
};
