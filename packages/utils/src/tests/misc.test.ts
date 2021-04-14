import { spy } from "simple-spy";
import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
import { callAll, compose, getInheritanceTree, pipe, wait } from "../misc";

group("callAll", (test) => {
    test("should return another function", () => {
        assert.ok(typeof callAll() === "function");
    });

    test("should call all functions provided", () => {
        const first = spy();
        const second = spy();

        callAll(first, second)();

        assert.ok(first.callCount === 1);
        assert.ok(second.callCount === 1);
    });

    test("should call all functions provided", () => {
        const first = spy();
        const second = spy();
        const third = spy();

        callAll(first, second)();

        assert.ok(first.callCount === 1);
        assert.ok(second.callCount === 1);
        assert.ok(third.callCount === 0);
    });

    test("should call all functions provided with the same args", () => {
        const args = { first: null, second: null, third: null } as any;
        const first = spy((...props) => (args.first = props));
        const second = spy((...props) => (args.second = props));

        callAll(first, second)("abc", "xyz");

        assert.equal(args.first, ["abc", "xyz"]);
        assert.equal(args.second, ["abc", "xyz"]);
    });

    test("should ignore falsy values", () => {
        const first = spy();
        const second = undefined as any;

        callAll(first, second)();

        assert.ok(first.callCount === 1);
    });
});

test("wait resolves after given delay and returns callback result if any", async () => {
    const ref = { done: false };
    const delay = 10;

    wait(delay, () => {
        ref.done = true;
        return 123;
    }).then((value) => assert.is(value, 123));
    assert.is(ref.done, false);
    setTimeout(() => {
        assert.is(ref.done, true);
    }, delay);
});

test("compose executes in one pass multiple functions on the same arg, right-to-left", async () => {
    const prependAbc = (value: string) => "abc" + value;
    const toUpper = (value: string) => value.toUpperCase();
    const appendXyz = (value: string) => value + "xyz";

    const composed = compose(prependAbc, toUpper, appendXyz);
    const result = await composed("yes");
    assert.is(result, "abcYESXYZ");

    const reversed = compose(...[prependAbc, toUpper, appendXyz].reverse());
    const reversedResult = await reversed("yes");
    assert.is(reversedResult, "ABCYESxyz");
});

test("pipe executes in one pass multiple functions on the same arg, left-to-right", async () => {
    const prependAbc = (value: string) => "abc" + value;
    const toUpper = (value: string) => value.toUpperCase();
    const appendXyz = (value: string) => value + "xyz";

    const piped = pipe(prependAbc, toUpper, appendXyz);
    const result = await piped("yes");
    assert.is(result, "ABCYESxyz");

    const reversed = pipe(...[prependAbc, toUpper, appendXyz].reverse());
    const reversedResult = await reversed("yes");
    assert.is(reversedResult, "abcYESXYZ");
});

test("getInheritanceTree", () => {
    class GrandParent {}
    class Parent extends GrandParent {}
    class Child extends Parent {}
    abstract class GrandChild extends Child {}
    class GreatGrandChild extends GrandChild {}

    assert.equal(getInheritanceTree(GreatGrandChild), [GreatGrandChild, GrandChild, Child, Parent, GrandParent]);
});

test.run();
