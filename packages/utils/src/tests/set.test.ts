import { test } from "uvu";
import assert from "uvu/assert";

import { getSetDifference, getSetIntersection, getSetUnion, getSymmetricDifference } from "../set";

test("getSetDifference should return the difference between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSetDifference(left, right), new Set([3, 4, 5]));
    assert.equal(getSetDifference(right, left), new Set([6, 7, 9]));
});

test("getSymmetricDifference should return the symmetrical difference between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSymmetricDifference(left, right), new Set([3, 4, 5, 6, 7, 9]));
});

test("getSetUnion should return the union between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSetUnion(left, right), new Set([1, 2, 3, 4, 5, 6, 7, 9]));
});

test("getSetIntersection should return the intersection between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.equal(getSetIntersection(left, right), new Set([1, 2]));
});

test.run();
