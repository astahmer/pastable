import { PartialBy } from "../typings";
import { createMachine, assign, interpret, forwardTo } from "xstate";
import { makeArrayOf } from "../utils/array";
import { wait } from "../utils/misc";

export const makePoolMachine = <Return = any>(params: MakePoolMachineParams<Return>) =>
    createMachine(
        {
            id: "pool",
            initial: "idle",
            tsTypes: {} as import("./poolMachine.typegen").Typegen0,
            schema: {
                context: {} as Context<Return>,
                events: {} as
                    | { type: "START" }
                    | { type: "task.started"; index: number }
                    | { type: "task.resolved"; index: number; result: Return }
                    | { type: "task.rejected"; index: number; error: any }
                    | { type: "UPDATE_CONCURRENCY"; concurrency: number }
                    | { type: "DONE" },
            },
            context: {
                concurrency: params.concurrency,
                delayInMs: params.delayInMs,
                runningList: [],
                resolvedList: [],
                rejectedList: [],
            },
            states: {
                idle: {
                    on: {
                        START: [{ target: "started", cond: () => Boolean(params.taskList.length) }, { target: "done" }],
                    },
                },
                started: {
                    invoke: {
                        id: "scheduler",
                        src: (ctx) => (sender, onReceive) => {
                            const pool = { runningList: [], pendingList: params.taskList.map((_, i) => i) } as PoolMap;

                            let isMounted = true;
                            const ref = { concurrency: ctx.concurrency };

                            onReceive((e) => {
                                if (e.type === "UPDATE_CONCURRENCY") {
                                    ref.concurrency = e.concurrency;
                                }
                            });

                            function invokeTask() {
                                const index = pool.pendingList.shift()!;
                                const task = params.taskList[index];
                                if (!task || !isMounted) return;

                                const promise = task();
                                sender({ type: `task.started`, index });

                                promise
                                    .then((result) => {
                                        if (!isMounted) return;
                                        sender({ type: `task.resolved`, index, result });
                                    })
                                    .catch((error) => {
                                        if (!isMounted) return;
                                        sender({ type: `task.rejected`, index, error });
                                    })
                                    .finally(() => {
                                        if (!isMounted) return;
                                        pool.runningList = pool.runningList.filter((i) => i !== index);
                                        onSettled();
                                    });

                                pool.runningList.push(index);
                            }

                            const onSettled = () => {
                                if (!isMounted) return;
                                if (!pool.pendingList.length) {
                                    if (!pool.runningList.length) sender({ type: "DONE" });
                                    return;
                                }

                                const emptySlotCount = Math.min(
                                    ref.concurrency - pool.runningList.length,
                                    pool.pendingList.length
                                );
                                if (emptySlotCount <= 0) return;

                                if (ctx.delayInMs) {
                                    setTimeout(() => {
                                        makeArrayOf(emptySlotCount).forEach(invokeTask);
                                    }, ctx.delayInMs);
                                } else {
                                    makeArrayOf(emptySlotCount).forEach(invokeTask);
                                }
                            };

                            makeArrayOf(ctx.concurrency).forEach(invokeTask);

                            return () => void (isMounted = false);
                        },
                    },
                    on: {
                        "task.started": { actions: ["addRunning", "onStart"] },
                        "task.resolved": { actions: ["addSuccess", "onSuccess"] },
                        "task.rejected": { actions: ["addError", "onError"] },
                        DONE: { target: "done", actions: "onDone" },
                        UPDATE_CONCURRENCY: { actions: ["updateConcurrency", "forwardToScheduler"] },
                    },
                },
                done: { type: "final" },
            },
            predictableActionArguments: true,
        },
        {
            actions: {
                addRunning: assign({
                    runningList: (ctx, event) => [...ctx.runningList, event.index],
                }),
                addSuccess: assign({
                    resolvedList: (ctx, event) => [...ctx.resolvedList, { index: event.index, result: event.result }],
                    runningList: (ctx, event) => ctx.runningList.filter((i) => i !== event.index),
                }),
                addError: assign({
                    rejectedList: (ctx, event) => [...ctx.rejectedList, { index: event.index, error: event.error }],
                    runningList: (ctx, event) => ctx.runningList.filter((i) => i !== event.index),
                }),
                onStart: (_ctx, event) => params.onStart?.(event.index),
                onSuccess: (_ctx, event) => params.onSuccess?.(event.result, event.index),
                onError: (_ctx, event) => params.onError?.(event.error, event.index),
                onDone: (ctx) => params.onDone?.(ctx),
                updateConcurrency: assign({ concurrency: (_ctx, event) => event.concurrency }),
                forwardToScheduler: forwardTo("scheduler"),
            },
        }
    );

interface Context<Return> extends Pick<MakePoolMachineParams<Return>, "concurrency" | "delayInMs"> {
    runningList: number[];
    resolvedList: Array<{
        index: number;
        result: Return;
    }>;
    rejectedList: Array<{
        index: number;
        error: any;
    }>;
}

type Thunk<Return = any> = () => Promise<Return>;

interface MakePoolMachineParams<Return = any> {
    taskList: Array<Thunk<Return>>;
    concurrency: number;
    delayInMs?: number;
    onStart?: (index: number) => void;
    onSuccess?: (result: Return, index: number) => void;
    onError?: (error: any, index: number) => void;
    onDone?: (ctx: Context<Return>) => void;
}

interface PoolMap {
    pendingList: Array<number>;
    runningList: Array<number>;
}

export const createPool = <Return = any>(
    taskList: MakePoolMachineParams<Return>["taskList"],
    { autoStart = true, ...params }: CreatePoolParams<Return> = {}
) => {
    const machine = makePoolMachine({ concurrency: 10, ...params, taskList });
    const service = interpret(machine).start();

    if (autoStart) service.send("START");

    return service;
};

export const createAsyncPool = <Return = any>(
    taskList: MakePoolMachineParams<Return>["taskList"],
    { autoStart = true, ...params }: CreatePoolParams<Return> = {}
): Promise<Return[]> => {
    if (!taskList.length) return Promise.resolve([]);

    const service = createPool(taskList, { concurrency: 10, ...params });
    return new Promise((resolve) =>
        service.onDone(() => resolve(service.state.context.resolvedList.map((r) => r.result)))
    );
};

interface CreatePoolParams<Return = any>
    extends Omit<PartialBy<MakePoolMachineParams<Return>, "concurrency" | "delayInMs">, "taskList"> {
    autoStart?: boolean;
}

if (import.meta.vitest) {
    const { it, expect, describe, vi } = import.meta.vitest;

    describe("poolMachine", () => {
        it("should create a pool machine that will invoke onSuccess callbacks", () =>
            new Promise((done) => {
                const taskList = makeArrayOf(10).map((_, i) => () => Promise.resolve(i + 1));
                const onSuccess = vi.fn();

                const machine = makePoolMachine({ concurrency: 5, taskList, onSuccess });
                const service = interpret(machine).start();
                service.send("START");

                service.onDone((e) => {
                    expect(onSuccess).toHaveBeenCalledTimes(taskList.length);
                    expect(service.state.context.resolvedList.map((r) => r.result)).toEqual(
                        taskList.map((_, i) => i + 1)
                    );
                    done();
                });
            }));

        it("should create a pool and not auto start", () => {
            const taskList = makeArrayOf(10).map((_, i) => () => Promise.resolve(i + 1));
            const service = createPool(taskList, { concurrency: 2, autoStart: false });

            expect(service.state.value).toBe("idle");
        });

        it("should create a pool that transitions to done instantly if passed an empty taskList", () => {
            expect(createPool([], { concurrency: 2 }).state.value).toBe("done");
        });

        it("should create a pool that resolves instantly if passed an empty taskList", async () => {
            const results = await createAsyncPool([]);
            expect(results).toEqual([]);
        });

        it("should create a pool service that will invoke callbacks", () =>
            new Promise((done) => {
                const taskList = makeArrayOf(10).map((_, i) => () => Promise.resolve(i + 1));
                const onSuccess = vi.fn();
                const onError = vi.fn();
                const onDone = vi.fn();

                const service = createPool(taskList, { concurrency: 2, onSuccess, onError, onDone });
                service.onDone((e) => {
                    expect(onSuccess).toHaveBeenCalledTimes(taskList.length);
                    expect(service.state.context.resolvedList.map((r) => r.result)).toEqual(
                        taskList.map((_, i) => i + 1)
                    );
                    expect(onError).not.toHaveBeenCalled();
                    expect(onDone).toHaveBeenCalledTimes(1);
                    done();
                });
            }));

        it("should create an async pool that will automatically resolve onDone with resolvedList", async () => {
            const taskList = makeArrayOf(5).map((_, i) => () => Promise.resolve(i + 1));
            const result = await createAsyncPool(taskList, { concurrency: 2 });
            expect(result).toEqual([1, 2, 3, 4, 5]);
        });

        it("should create an async pool that will automatically resolve even if some task failed", async () => {
            const taskList = makeArrayOf(5).map(
                (_, i) => () => i === 1 || i === 3 ? Promise.reject("boom-" + i) : Promise.resolve(i + 1)
            );
            const onError = vi.fn((e, i) => expect(e).toBe("boom-" + i));
            const result = await createAsyncPool(taskList, { concurrency: 2, onError });
            expect(result).toEqual([1, 3, 5]);
            expect(onError).toHaveBeenCalledTimes(2);
        });

        it("should only execute tasks until concurrency is reached", async () => {
            const taskList = makeArrayOf(16).map((_, i) => async () => {
                await wait(i === 2 ? 20 : 10);
                return Promise.resolve(i + 1);
            });
            const service = createPool(taskList, { concurrency: 2 });

            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([]);
            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2, 4]);
            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2, 4, 3, 5]);

            service.send({ type: "UPDATE_CONCURRENCY", concurrency: 4 });

            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2, 4, 3, 5, 6, 7]);
            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([
                1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11,
            ]);
            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([
                1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            ]);
            await wait(10);
            expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([
                1, 2, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
            ]);
        });
    });

    it("should wait given delayInMs between tasks", async () => {
        const taskList = makeArrayOf(4).map((_, i) => async () => {
            await wait(10);
            return Promise.resolve(i + 1);
        });
        const service = createPool(taskList, { concurrency: 2 });

        expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([]);
        expect(service.state.context.runningList.map((i) => i)).toEqual([0, 1]);
        await wait(10);
        expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        expect(service.state.context.runningList.map((i) => i)).toEqual([2, 3]);
        await wait(10);
        expect(service.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2, 3, 4]);
        expect(service.state.context.runningList.map((i) => i)).toEqual([]);

        const serviceWithDelayInBetween = createPool(taskList, { concurrency: 2, delayInMs: 50 });

        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([]);
        expect(serviceWithDelayInBetween.state.context.runningList.map((i) => i)).toEqual([0, 1]);
        await wait(10);
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        expect(serviceWithDelayInBetween.state.context.runningList.map((i) => i)).toEqual([]);

        // waiting 50ms (delayInMs before starting)
        await wait(10);
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        await wait(10);
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        await wait(10);
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        await wait(10);
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        await wait(10);

        // we waited the 50ms additional time from delayInMs so we will start the next tasks
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2]);
        expect(serviceWithDelayInBetween.state.context.runningList.map((i) => i)).toEqual([2, 3]);

        await wait(10);
        // we should now have the tasks result
        expect(serviceWithDelayInBetween.state.context.resolvedList.map((r) => r.result)).toEqual([1, 2, 3, 4]);
        expect(serviceWithDelayInBetween.state.context.runningList.map((i) => i)).toEqual([]);
    });
}
