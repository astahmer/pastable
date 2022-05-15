import { test } from "uvu";
import assert from "uvu/assert";

import { firstKey, firstProp, getSelf, makeSelfGetters, prop } from "../getters";

test("getSelf", () => {
    assert.is(getSelf("abc"), "abc");
});

test("makeSelfGetters", () => {
    const values = { target: 111, fromKey: "aaa", snake_case: "sss", deep: { value: "yes" } };
    const getters = makeSelfGetters(["target", "fromKey", "snake_case"]);
    const keys = Object.keys(getters);
    assert.equal(
        keys.map((key) => getters[key](values[key as keyof typeof values])),
        [111, "aaa", "sss"]
    );
});

test("firstKey", () => {
    assert.is(firstKey({ abc: 123 }), "abc");
    assert.is(firstKey({ abc: 123, def: 456 }), "abc");
});
test("firstProp", () => {
    assert.is(firstProp({ abc: 123 }), 123);
    assert.is(firstProp({ abc: 123, def: 456 }), 123);
});
test("prop", () => {
    assert.is(prop("abc")({ abc: 123, def: 456 }), 123);
});

test.run();
