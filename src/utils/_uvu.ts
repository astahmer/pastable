import { Context, suite, uvu } from "uvu";

export type TestFn = (test: uvu.Test<Context>) => void;

// https://github.com/lukeed/uvu/issues/43
export function group(name: string, fn: TestFn, context?: Context) {
    const testSuite = suite(name, context);
    fn(testSuite);
    testSuite.run();
}

export const makePrefixedGroup = (prefix: string) => (name: string | string[], fn: TestFn) =>
    group(prefix + "/" + name, fn);
