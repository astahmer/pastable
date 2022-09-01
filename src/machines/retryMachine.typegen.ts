// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
    "@@xstate/typegen": true;
    internalEvents: {
        "error.platform.callback": { type: "error.platform.callback"; data: unknown };
        "xstate.after(RETRY)#retry.rejected": { type: "xstate.after(RETRY)#retry.rejected" };
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
        incrementAttempt: "xstate.after(RETRY)#retry.rejected";
        onRejected: "error.platform.callback";
        setPauseDuration: "xstate.after(RETRY)#retry.rejected";
    };
    eventsCausingServices: {};
    eventsCausingGuards: {
        hasReachedMaxAttempts: "error.platform.callback";
    };
    eventsCausingDelays: {
        RETRY: "error.platform.callback";
    };
    matchesStates: "error" | "pending" | "rejected" | "success";
    tags: never;
}
