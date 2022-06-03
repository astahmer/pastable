import { assert, describe, expect, it, vi } from "vitest";
import { callAll, compose, getInheritanceTree, makeCompiledFnWith, pipe, wait } from "../misc";

describe("callAll", (test) => {
    it("should return another function", () => {
        assert.ok(typeof callAll() === "function");
    });

    it("should call all functions provided", () => {
        const first = vi.fn();
        const second = vi.fn();

        callAll(first, second)();

        assert.ok(first.mock.calls.length === 1);
        assert.ok(second.mock.calls.length === 1);
    });

    it("should call all functions provided", () => {
        const first = vi.fn();
        const second = vi.fn();
        const third = vi.fn();

        callAll(first, second)();

        assert.ok(first.mock.calls.length === 1);
        assert.ok(second.mock.calls.length === 1);
        assert.ok(third.mock.calls.length === 0);
    });

    it("should call all functions provided with the same args", () => {
        const args = { first: null, second: null, third: null } as any;
        const first = vi.fn((...props) => (args.first = props));
        const second = vi.fn((...props) => (args.second = props));

        callAll(first, second)("abc", "xyz");

        assert.deepEqual(args.first, ["abc", "xyz"]);
        assert.deepEqual(args.second, ["abc", "xyz"]);
    });

    it("should ignore falsy values", () => {
        const first = vi.fn();
        const second = undefined as any;

        callAll(first, second)();

        assert.ok(first.mock.calls.length === 1);
    });
});

it("wait resolves after given delay and returns callback result if any", async () => {
    const ref = { done: false };
    const delay = 10;

    wait(delay, () => {
        ref.done = true;
        return 123;
    }).then((value) => assert.deepEqual(value, 123));
    assert.deepEqual(ref.done, false);
    setTimeout(() => {
        assert.deepEqual(ref.done, true);
    }, delay);
});

it("compose executes in one pass multiple functions on the same arg, right-to-left", async () => {
    const prependAbc = (value: string) => "abc" + value;
    const toUpper = (value: string) => value.toUpperCase();
    const appendXyz = (value: string) => value + "xyz";

    const composed = compose(prependAbc, toUpper, appendXyz);
    const result = await composed("yes");
    assert.deepEqual(result, "abcYESXYZ" as any);

    const reversed = compose(...[prependAbc, toUpper, appendXyz].reverse());
    const reversedResult = await reversed("yes");
    assert.deepEqual(reversedResult, "ABCYESxyz" as any);
});

it("pipe executes in one pass multiple functions on the same arg, left-to-right", async () => {
    const prependAbc = (value: string) => "abc" + value;
    const toUpper = (value: string) => value.toUpperCase();
    const appendXyz = (value: string) => value + "xyz";

    const piped = pipe(prependAbc, toUpper, appendXyz);
    const result = await piped("yes");
    assert.deepEqual(result, "ABCYESxyz" as any);

    const reversed = pipe(...[prependAbc, toUpper, appendXyz].reverse());
    const reversedResult = await reversed("yes");
    assert.deepEqual(reversedResult, "abcYESXYZ" as any);
});

it("getInheritanceTree", () => {
    class GrandParent {}
    class Parent extends GrandParent {}
    class Child extends Parent {}
    abstract class GrandChild extends Child {}
    class GreatGrandChild extends GrandChild {}

    assert.deepEqual(getInheritanceTree(GreatGrandChild), [GreatGrandChild, GrandChild, Child, Parent, GrandParent]);
});

it("makeCompiledFnWith", () => {
    expect(
        makeCompiledFnWith("return aaa + bbb", {
            aaa: 111,
            bbb: 222,
        })
    ).toBe(333);

    const fn = makeCompiledFnWith("if (aaa > bbb) return 'yes'; return function () { return 'inner-' + bbb; };", {
        aaa: 111,
        bbb: 222,
    });
    expect(typeof fn === "function").toBe(true);
    expect(fn()).toBe("inner-222");
});
