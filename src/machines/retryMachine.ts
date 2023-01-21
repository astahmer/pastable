import { AnyFunction } from "../typings";
import { assign, createMachine, interpret, DoneInvokeEvent, DoneEvent } from "xstate";

const makeRetryMachine = <Result = any>({ callback, onRejected, ...ctx }: MakeRetryMachineParams<Result>) =>
    createMachine(
        {
            id: "retry",
            initial: "pending",
            schema: {
                context: {} as Context,
                events: {} as
                    | { type: "RETRY" }
                    | { type: "done.invoke.callback"; data: any }
                    | { type: "error.platform.callback"; data: any },
            },
            tsTypes: {} as import("./retryMachine.typegen").Typegen0,
            context: {
                retryCount: 0,
                maxAttempt: 5,
                pauseDuration: 500,
                pauseCoeff: 1.2,
                ...ctx,
            },
            states: {
                pending: {
                    invoke: {
                        id: "callback",
                        src: () =>
                            // safely promisify the function so we can handle errors even for sync functions
                            new Promise(async (resolve, reject) => {
                                try {
                                    resolve(await callback());
                                } catch (error) {
                                    reject(error);
                                }
                            }),
                        onDone: "success",
                        onError: [{ target: "error", cond: "hasReachedMaxAttempts" }, { target: "rejected" }],
                    },
                },
                rejected: {
                    entry: "onRejected",
                    after: {
                        RETRY: { actions: ["setPauseDuration", "incrementAttempt"], target: "pending" },
                    },
                },
                error: {
                    type: "final",
                    data: (_ctx, event) => ({ data: (event as DoneInvokeEvent<unknown>).data, status: "error" }),
                },
                success: {
                    type: "final",
                    data: (_ctx, event) => ({ data: (event as DoneInvokeEvent<Result>).data, status: "success" }),
                },
            },
        },
        {
            actions: {
                incrementAttempt: assign({ retryCount: (ctx) => ctx.retryCount + 1 }),
                setPauseDuration: assign({ pauseDuration: (ctx) => ctx.pauseDuration * ctx.pauseCoeff }),
                onRejected: (ctx, event) => onRejected?.(event.data, ctx.retryCount),
            },
            guards: {
                hasReachedMaxAttempts: (ctx) => ctx.retryCount + 1 === ctx.maxAttempt,
            },
            delays: {
                RETRY: (ctx) => ctx.pauseDuration,
            },
        }
    );

interface Context {
    retryCount: number;
    maxAttempt: number;
    pauseDuration: number;
    pauseCoeff: number;
}

interface MakeRetryMachineParams<Result = any>
    extends Partial<Pick<Context, "maxAttempt" | "pauseDuration" | "pauseCoeff">> {
    callback: AnyFunction<Promise<Result>>;
    onRejected?: (error: any, retryCount: number) => void;
}

export type RetryDoneEvent<Result = any, Status extends "success" | "error" = any> = Status extends "success"
    ? { data: Result; status: "success" }
    : { data: unknown; status: "error" };

export async function retryIt<Result = any>(
    callback: MakeRetryMachineParams<Result>["callback"],
    options?: Omit<MakeRetryMachineParams, "callback">
): Promise<Result> {
    const retryMachine = makeRetryMachine({ callback, ...options });
    const service = interpret(retryMachine).start();

    return new Promise((resolve, reject) => {
        service.onDone((event) => {
            if (service.state.matches("success")) resolve(event.data.data);
            if (service.state.matches("error")) reject(event.data.data);
        });
    });
}

if (import.meta.vitest) {
    const { it, expect, describe, vi } = import.meta.vitest;

    describe("makeRetryMachine", () => {
        it("should resolve value", () =>
            new Promise((done) => {
                const machine = makeRetryMachine({ callback: () => Promise.resolve("hello") });
                interpret(machine)
                    .onTransition((state, event) => {
                        if (state.matches("success")) {
                            expect((event as DoneEvent).data).toBe("hello");
                        }
                    })
                    .onDone((e) => {
                        const event = e as DoneInvokeEvent<RetryDoneEvent<"hello", "success">>;
                        expect(event.data.status).toBe("success");
                        expect(event.data.data).toBe("hello");
                        done();
                    })
                    .start();
            }));

        it("should reject value & call onRejected", () =>
            new Promise((done) => {
                let retry = 0;
                const machine = makeRetryMachine({
                    pauseDuration: 100,
                    callback: async () => {
                        throw new Error("boom");
                    },
                    onRejected: (err, retryCount) => {
                        expect(err).toBeInstanceOf(Error);
                        expect(err.message).toBe("boom");
                        expect(retryCount).toBe(retry++);
                    },
                });
                interpret(machine)
                    .onTransition((state, event) => {
                        if (state.matches("error")) {
                            expect((event as DoneEvent).data.message).toBe("boom");
                        }
                    })
                    .onDone((e) => {
                        const event = e as DoneInvokeEvent<RetryDoneEvent<"boom", "error">>;
                        expect(event.data.status).toBe("error");
                        expect((event.data.data as Error).message).toBe("boom");
                        done();
                    })
                    .start();
            }));
    });

    describe("retryIt", () => {
        it("will resolve value", () => {
            const value = retryIt(async () => "value");
            expect(value).resolves.toBe("value");
        });

        it("will reject value", () => {
            const value = retryIt(async () => {
                throw new Error("value");
            });
            expect(value).rejects.toThrow("value");
        });

        it("should retry the SYNC callback and invoke rejected callback", async () => {
            let attempt = 0;
            const callback = vi.fn(() => {
                attempt++;
                if (attempt === 1 || attempt === 2) {
                    throw new Error("boom");
                }
                return Promise.resolve("hello");
            });
            const onRejected = vi.fn((err, retryCount) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe("boom");
                expect(retryCount).toBe(attempt - 1);
            });
            const result = await retryIt(callback, { pauseDuration: 100, onRejected });
            expect(result).toBe("hello");
            expect(callback).toHaveBeenCalledTimes(3);
            expect(onRejected).toHaveBeenCalledTimes(2);
        });
    });
}
