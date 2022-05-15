import { assert, it } from "vitest";
import {
    format,
    getCommonKeys,
    hasShallowDiff,
    hasShallowDiffInCommonKeys,
    omit,
    pick,
    pickBy,
    pickDefined,
    removeUndefineds,
} from "../pick";

it("pick", () => {
    const base = { aaa: 111, bbb: 222, ccc: "333" };
    assert.deepEqual(pick(base, ["aaa", "ccc"]), { aaa: 111, ccc: "333" } as any);
});

it("pickBy", () => {
    const base = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.deepEqual(
        pickBy(base, ["aaa", "ccc", "ddd"], (key, value) => key === "ddd" || typeof value === "number"),
        { aaa: 111, ddd: "444" }
    );
});

it("pickDefined", () => {
    const base = { aaa: 111, bbb: 222, ccc: null as null, ddd: undefined as undefined };
    assert.deepEqual(pickDefined(base, ["aaa", "ccc", "ddd"]), { aaa: 111 });
});

it("omit", () => {
    const base = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.deepEqual(omit(base, ["aaa", "bbb", "ddd"]), { ccc: "333" });
});

it("removeUndefineds - keep only truthy values", () => {
    const obj = { a: 123, b: "bbb", c: null as any, d: false, e: true, f: () => {}, g: undefined as any };
    const keys = Object.keys(removeUndefineds(obj));
    const definedKeys = ["a", "b", "d", "e", "f"];

    assert.deepEqual(definedKeys, keys);
    assert.deepEqual(definedKeys, Object.keys(removeUndefineds(obj)));
});

it("format - use a custom formater for object values", () => {
    const obj = { a: 111, b: 222, c: "333" };

    assert.deepEqual(
        format(obj, (value) => "id-" + value),
        {
            a: "id-111",
            b: "id-222",
            c: "id-333",
        }
    );
});

it("hasShallowDiff", () => {
    const ding = { aaa: 111, bbb: 222 };
    const dong = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.deepEqual(hasShallowDiff(ding, dong), true);
    assert.deepEqual(hasShallowDiff(ding, ding), false);
    assert.deepEqual(hasShallowDiff(ding, { ...ding }), false);

    const nested = { shallow: "yes" };
    const dang = { ...ding, nested };
    nested.shallow = "no";
    const dung = { ...ding, nested };
    assert.deepEqual(hasShallowDiff(dang, dung), false);
});

it("getCommonKeys", () => {
    const ding = { aaa: 111, bbb: 222 };
    const dong = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.deepEqual(getCommonKeys(ding, dong), ["aaa", "bbb"]);
});

it("hasShallowDiffInCommonKeys", () => {
    const ding = { aaa: 111, bbb: 222 };
    const dong = { aaa: 111, bbb: 222, ccc: 333 };
    assert.deepEqual(hasShallowDiffInCommonKeys(ding, dong), false);
    dong.bbb = 999;
    assert.deepEqual(hasShallowDiffInCommonKeys(ding, dong), true);
});
