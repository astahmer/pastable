import { assert, it } from "vitest";
import { getSetDifference, getSetIntersection, getSetUnion, getSymmetricDifference } from "../set";

it("getSetDifference should return the difference between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.containSubset(getSetDifference(left, right), new Set([3, 4, 5]));
    assert.containSubset(getSetDifference(right, left), new Set([6, 7, 9]));
});

it("getSymmetricDifference should return the symmetrical difference between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.containSubset(getSymmetricDifference(left, right), new Set([3, 4, 5, 6, 7, 9]));
});

it("getSetUnion should return the union between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.containSubset(getSetUnion(left, right), new Set([1, 2, 3, 4, 5, 6, 7, 9]));
});

it("getSetIntersection should return the intersection between 2 arrays", () => {
    const left = new Set([1, 2, 3, 4, 5]);
    const right = new Set([6, 7, 1, 2, 9]);
    assert.containSubset(getSetIntersection(left, right), new Set([1, 2]));
});
