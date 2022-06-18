// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    eventsCausingActions: {
        addRunning: "task.started";
        onStart: "task.started";
        addSuccess: "task.resolved";
        onSuccess: "task.resolved";
        addError: "task.rejected";
        onError: "task.rejected";
        onDone: "DONE";
        updateConcurrency: "UPDATE_CONCURRENCY";
        forwardToScheduler: "UPDATE_CONCURRENCY";
    };
    internalEvents: {
        "xstate.init": { type: "xstate.init" };
    };
    invokeSrcNameMap: {};
    missingImplementations: {
        actions: never;
        services: never;
        guards: never;
        delays: never;
    };
    eventsCausingServices: {};
    eventsCausingGuards: {};
    eventsCausingDelays: {};
    matchesStates: "idle" | "started" | "done";
    tags: never;
}
