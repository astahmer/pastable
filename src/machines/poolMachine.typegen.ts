// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
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
    eventsCausingActions: {
        addError: "task.rejected";
        addRunning: "task.started";
        addSuccess: "task.resolved";
        forwardToScheduler: "UPDATE_CONCURRENCY";
        onDone: "DONE";
        onError: "task.rejected";
        onStart: "task.started";
        onSuccess: "task.resolved";
        updateConcurrency: "UPDATE_CONCURRENCY";
    };
    eventsCausingServices: {};
    eventsCausingGuards: {};
    eventsCausingDelays: {};
    matchesStates: "done" | "idle" | "started";
    tags: never;
}
