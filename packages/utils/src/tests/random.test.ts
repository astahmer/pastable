import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
import { getIntersection, hasAll, makeArrayOf, uniques } from "../array";
import { getRandomIntInt, getRandomString, pickMultipleUnique, pickOne, pickOneBut, pickOneInEnum } from "../random";

test("getRandomString", () => {
    assert.is(getRandomString().length === 10, true);
    assert.is(getRandomString(5).length === 5, true);
    assert.is(getRandomString(10).length === 10, true);
    assert.is(typeof getRandomString() === "string", true);
});

test("getRandomIntInt", () => {
    assert.is(typeof getRandomIntInt(10) === "number", true);

    const makeInt = () => getRandomIntInt(-5, 5);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makeInt()), []);
    assert.is(Math.min(...results) >= -5, true);
    assert.is(Math.max(...results) <= 5, true);

    const makeIntWithJustMax = () => getRandomIntInt(10);
    const resultsWithJustMax = makeArrayOf(100).reduce((acc) => acc.concat(makeIntWithJustMax()), []);
    assert.is(Math.min(...resultsWithJustMax) >= 0, true);
    assert.is(Math.max(...resultsWithJustMax) <= 10, true);
});

group("pickMultipleUnique", (test) => {
    test("pick n given random", () => {
        const base = [1, 2, 3, 4, 5];
        assert.is(pickMultipleUnique(base, 1).length === 1, true);
        assert.is(pickMultipleUnique(base, 2).length === 2, true);
        assert.is(pickMultipleUnique(base, 3).length === 3, true);
    });
    test("cant pick more than array length", () => {
        const base = [1, 2, 3, 4, 5];
        assert.equal(pickMultipleUnique(base, 10).length === base.length, true);
    });
    test("should not have duplicates", () => {
        const base = [1, 2, 3, 4, 5];
        const result = pickMultipleUnique(base, 4);

        assert.is(result.length === uniques(result).length, true);
    });
    test("can exclude some", () => {
        const base = [1, 2, 3, 4, 5];
        const makePick = () => pickMultipleUnique(base, 3, [4, 5]);
        const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);

        assert.is(getIntersection(results, [4, 5]).length === 0, true);
    });
});

test("pickOne", () => {
    const base = [1, 2, 3, 4, 5];
    const makePick = () => pickOne(base);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);
    assert.is(hasAll(base, results), true);
});

test("pickOneBut", () => {
    const base = [1, 2, 3, 4, 5];
    const makePick = () => pickOneBut(base, [3, 5]);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);

    assert.is(hasAll(base, results), true);
    assert.is(hasAll(results, base), false);
    assert.is(hasAll(results, [3, 5]), false);
    assert.is(hasAll(results, [1, 2, 4]), true);
});

test("pickOneInEnum", () => {
    enum Example {
        FIRST = "first",
        SECOND = "second",
        THIRD = "third",
        FOUR = "four",
        FIVE = "five",
    }

    const makePick = () => pickOneInEnum(Example, ["third", "five"] as Example[]);
    const results = makeArrayOf(100).reduce((acc) => acc.concat(makePick()), []);

    assert.is(hasAll(Object.values(Example), results), true);
    assert.is(hasAll(results, Object.values(Example)), false);
    assert.is(hasAll(results, ["third", "five"]), false);
    assert.is(hasAll(results, ["first", "second", "four"]), true);
});
