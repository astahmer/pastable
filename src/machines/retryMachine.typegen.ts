// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    eventsCausingActions: {
        setPauseDuration: "xstate.after(RETRY)#retry.rejected";
        incrementAttempt: "xstate.after(RETRY)#retry.rejected";
        onRejected: "error.platform.callback";
    };
    internalEvents: {
        "xstate.after(RETRY)#retry.rejected": { type: "xstate.after(RETRY)#retry.rejected" };
        "error.platform.callback": { type: "error.platform.callback"; data: unknown };
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
    eventsCausingGuards: {
        hasReachedMaxAttempts: "error.platform.callback";
    };
    eventsCausingDelays: {
        RETRY: "xstate.init";
    };
    matchesStates: "pending" | "rejected" | "error" | "success";
    tags: never;
}
