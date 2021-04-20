import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
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

test("pick", () => {
    const base = { aaa: 111, bbb: 222, ccc: "333" };
    assert.equal(pick(base, ["aaa", "ccc"]), { aaa: 111, ccc: "333" });
});

test("pickBy", () => {
    const base = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.equal(
        pickBy(base, ["aaa", "ccc", "ddd"], (key, value) => key === "ddd" || typeof value === "number"),
        { aaa: 111, ddd: "444" }
    );
});

test("pickDefined", () => {
    const base = { aaa: 111, bbb: 222, ccc: null as null, ddd: undefined as undefined };
    assert.equal(pickDefined(base, ["aaa", "ccc", "ddd"]), { aaa: 111 });
});

test("omit", () => {
    const base = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.equal(omit(base, ["aaa", "bbb", "ddd"]), { ccc: "333" });
});

test("removeUndefineds - keep only truthy values", () => {
    const obj = { a: 123, b: "bbb", c: null as any, d: false, e: true, f: () => {}, g: undefined as any };
    const keys = Object.keys(removeUndefineds(obj));
    const definedKeys = ["a", "b", "d", "e", "f"];

    assert.equal(definedKeys, keys);
    assert.equal(definedKeys, Object.keys(removeUndefineds(obj)));
});

test("format - use a custom formater for object values", () => {
    const obj = { a: 111, b: 222, c: "333" };

    assert.equal(
        format(obj, (value) => "id-" + value),
        {
            a: "id-111",
            b: "id-222",
            c: "id-333",
        }
    );
});

test("hasShallowDiff", () => {
    const ding = { aaa: 111, bbb: 222 };
    const dong = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.is(hasShallowDiff(ding, dong), true);
    assert.is(hasShallowDiff(ding, ding), false);
    assert.is(hasShallowDiff(ding, { ...ding }), false);

    const nested = { shallow: "yes" };
    const dang = { ...ding, nested };
    nested.shallow = "no";
    const dung = { ...ding, nested };
    assert.is(hasShallowDiff(dang, dung), false);
});

test("getCommonKeys", () => {
    const ding = { aaa: 111, bbb: 222 };
    const dong = { aaa: 111, bbb: 222, ccc: "333", ddd: "444" };
    assert.equal(getCommonKeys(ding, dong), ["aaa", "bbb"]);
});

test("hasShallowDiffInCommonKeys", () => {
    const ding = { aaa: 111, bbb: 222 };
    const dong = { aaa: 111, bbb: 222, ccc: 333 };
    assert.is(hasShallowDiffInCommonKeys(ding, dong), false);
    dong.bbb = 999;
    assert.is(hasShallowDiffInCommonKeys(ding, dong), true);
});

test.run();
