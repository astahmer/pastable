import { assert, it } from "vitest";
import { firstKey, firstProp, getSelf, makeSelfGetters, prop } from "../getters";

it("getSelf", () => {
    assert.equal(getSelf("abc"), "abc");
});

it("makeSelfGetters", () => {
    const values = { target: 111, fromKey: "aaa", snake_case: "sss", deep: { value: "yes" } };
    const getters = makeSelfGetters(["target", "fromKey", "snake_case"]);
    const keys = Object.keys(getters);
    assert.deepEqual(
        keys.map((key) => getters[key](values[key as keyof typeof values])),
        [111, "aaa", "sss"]
    );
});

it("firstKey", () => {
    assert.equal(firstKey({ abc: 123 }), "abc");
    assert.equal(firstKey({ abc: 123, def: 456 }), "abc");
});
it("firstProp", () => {
    assert.equal(firstProp({ abc: 123 }), 123);
    assert.equal(firstProp({ abc: 123, def: 456 }), 123);
});
it("prop", () => {
    assert.equal(prop("abc")({ abc: 123, def: 456 }), 123);
});
