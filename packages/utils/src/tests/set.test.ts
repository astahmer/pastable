import { test } from "uvu";
import assert from "uvu/assert";

import { getSetDifference, getSetIntersection, getSetUnion, getSymmetricDifference } from "../set";

test("getSetDifference should return the difference between 2 arrays", () => {
    const ding = new Set([1, 2, 3, 4, 5]);
    const dong = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSetDifference(ding, dong), new Set([3, 4, 5]));
    assert.equal(getSetDifference(dong, ding), new Set([6, 7, 9]));
});

test("getSymmetricDifference should return the symmetrical difference between 2 arrays", () => {
    const ding = new Set([1, 2, 3, 4, 5]);
    const dong = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSymmetricDifference(ding, dong), new Set([3, 4, 5, 6, 7, 9]));
});

test("getSetUnion should return the union between 2 arrays", () => {
    const ding = new Set([1, 2, 3, 4, 5]);
    const dong = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSetUnion(ding, dong), new Set([1, 2, 3, 4, 5, 6, 7, 9]));
});

test("getSetIntersection should return the intersection between 2 arrays", () => {
    const ding = new Set([1, 2, 3, 4, 5]);
    const dong = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSetIntersection(ding, dong), new Set([1, 2]));
});

test.run();
