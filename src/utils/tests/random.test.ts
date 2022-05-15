import { assert, describe, it } from "vitest";
import { getIntersection, hasAll, makeArrayOf, uniques } from "../array";
import {
    getRandomFloatIn,
    getRandomIntIn,
    getRandomPercent,
    getRandomString,
    makeArrayOfRandIn,
    pickMultipleUnique,
    pickOne,
    pickOneBut,
    pickOneInEnum,
} from "../random";

it("getRandomString", () => {
    assert.equal(getRandomString().length === 10, true);
    assert.equal(getRandomString(5).length === 5, true);
    assert.equal(getRandomString(10).length === 10, true);
    assert.equal(typeof getRandomString() === "string", true);
});

it("getRandomIntIn", () => {
    assert.equal(typeof getRandomIntIn(10) === "number", true);

    const makeInt = () => getRandomIntIn(-5, 5);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makeInt()), []);
    assert.equal(Math.min(...results) >= -5, true);
    assert.equal(Math.max(...results) <= 5, true);

    const makeIntWithJustMax = () => getRandomIntIn(10);
    const resultsWithJustMax = makeArrayOf(100).reduce((acc) => acc.concat(makeIntWithJustMax()), []);
    assert.equal(Math.min(...resultsWithJustMax) >= 0, true);
    assert.equal(Math.max(...resultsWithJustMax) <= 10, true);
});

it("getRandomFloatIn", () => {
    assert.equal(typeof getRandomFloatIn(10) === "number", true);
    assert.equal(Number.isInteger(getRandomFloatIn(10)), false);

    const makeInt = () => getRandomFloatIn(-5, 5);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makeInt()), []);
    assert.equal(Math.min(...results) >= -5, true);
    assert.equal(Math.max(...results) <= 5, true);

    const makeIntWithJustMax = () => getRandomFloatIn(10);
    const resultsWithJustMax = makeArrayOf(100).reduce((acc) => acc.concat(makeIntWithJustMax()), []);
    assert.equal(Math.min(...resultsWithJustMax) >= 0, true);
    assert.equal(Math.max(...resultsWithJustMax) <= 10, true);
});

it("getRandomPercent", () => {
    assert.equal(typeof getRandomPercent(10) === "number", true);

    const makeInt = () => getRandomPercent(0);
    const results: number[] = makeArrayOf(100).reduce((acc) => acc.concat(makeInt()), []);
    assert.equal(Math.min(...results) >= 0, true);
    assert.equal(Math.max(...results) <= 100, true);
    assert.equal(
        results.every((item) => Number.isInteger(item)),
        true
    );

    const makeIntWith2Decimals = () => getRandomPercent(2);
    const resultsWith2Decimals: number[] = makeArrayOf(100).reduce((acc) => acc.concat(makeIntWith2Decimals()), []);
    assert.equal(Math.min(...resultsWith2Decimals) >= 0, true);
    assert.equal(Math.max(...resultsWith2Decimals) <= 100, true);
    assert.equal(
        resultsWith2Decimals.some((item) => !Number.isInteger(item)),
        true
    );
});

describe("pickMultipleUnique", (test) => {
    it("pick n given random", () => {
        const base = [1, 2, 3, 4, 5];
        assert.equal(pickMultipleUnique(base, 1).length === 1, true);
        assert.equal(pickMultipleUnique(base, 2).length === 2, true);
        assert.equal(pickMultipleUnique(base, 3).length === 3, true);
    });
    it("cant pick more than array length", () => {
        const base = [1, 2, 3, 4, 5];
        assert.equal(pickMultipleUnique(base, 10).length === base.length, true);
    });
    it("should not have duplicates", () => {
        const base = [1, 2, 3, 4, 5];
        const result = pickMultipleUnique(base, 4);

        assert.equal(result.length === uniques(result).length, true);
    });
    it("can exclude some", () => {
        const base = [1, 2, 3, 4, 5];
        const makePick = () => pickMultipleUnique(base, 3, [4, 5]);
        const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);

        assert.equal(getIntersection(results, [4, 5]).length === 0, true);
    });
});

it("pickOne", () => {
    const base = [1, 2, 3, 4, 5];
    const makePick = () => pickOne(base);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);
    assert.equal(hasAll(base, results), true);
});

it("pickOneBut", () => {
    const base = [1, 2, 3, 4, 5];
    const makePick = () => pickOneBut(base, [3, 5]);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);

    assert.equal(hasAll(base, results), true);
    assert.equal(hasAll(results, base), false);
    assert.equal(hasAll(results, [3, 5]), false);
    assert.equal(hasAll(results, [1, 2, 4]), true);
});

it("pickOneInEnum", () => {
    enum Example {
        FIRST = "first",
        SECOND = "second",
        THIRD = "third",
        FOUR = "four",
        FIVE = "five",
    }

    const makePick = () => pickOneInEnum(Example, ["third", "five"] as Example[]);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);

    assert.equal(hasAll(Object.values(Example), results), true);
    assert.equal(hasAll(results, Object.values(Example)), false);
    assert.equal(hasAll(results, ["third", "five"]), false);
    assert.equal(hasAll(results, ["first", "second", "four"]), true);
});

it("makeArrayOf", () => {
    const arr = makeArrayOfRandIn(5, 10);
    assert.equal(arr.length >= 5 && arr.length <= 10, true);
});
