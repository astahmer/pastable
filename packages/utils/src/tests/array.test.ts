import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
import {
    chunk,
    combineUniqueValues,
    exclude,
    findBy,
    first,
    flatMap,
    getDiff,
    getIntersection,
    getSymmetricDiff,
    getUnion,
    hasAll,
    isEqualArrays,
    last,
    makeArrayOf,
    pluck,
    sortBy,
    uniques,
} from "../array";

test("getDiff should return the difference between 2 arrays", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    assert.equal(getDiff(ding, dong), [3, 4, 5]);
    assert.equal(getDiff(dong, ding), [6, 7, 9]);
});

test("getSymmetricDiff should return the symmetrical difference between 2 arrays", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    assert.equal(getSymmetricDiff(ding, dong), [3, 4, 5, 6, 7, 9]);
});

test("getUnion should return the union between 2 arrays", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    assert.equal(getUnion(ding, dong), [1, 2, 3, 4, 5, 6, 7, 9]);
});

test("getIntersection should return the intersection between 2 arrays", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    assert.equal(getIntersection(ding, dong), [1, 2]);
});

group("hasAll", (test) => {
    test("should return false when every values of right are not in left", () => {
        const ding = [1, 2, 3, 4, 5];
        const dong = [6, 7, 1, 2, 9];
        assert.is(hasAll(ding, dong), false);
        assert.is(hasAll(dong, ding), false);
    });
    test("should return true when every values of right are in left", () => {
        const ding = [1, 2, 3, 4, 5];
        const dong = [6, 7, 1, 2, 3, 4, 5, 9];
        assert.is(hasAll(ding, dong), false);
        assert.is(hasAll(dong, ding), true);
    });
});

test("uniques", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    assert.equal(uniques(ding.concat(dong)), [1, 2, 3, 4, 5, 6, 7, 9]);
});

test("exclude should return base array without excluded items", () => {
    const base = [1, 2, 3, 4, 5];
    const excluded = [3, 5];
    assert.equal(exclude(base, excluded), [1, 2, 4]);
});

group("findBy", (test) => {
    test("should find an object from a value and its property path", () => {
        const base = [
            { id: 1, aaa: 111 },
            { id: 2, aaa: 222 },
            { id: 3, aaa: 333 },
            { id: 4, aaa: 444 },
        ];
        assert.equal(findBy(base, "aaa", 333), { id: 3, aaa: 333 });
    });
    test("should return the index if provided bool", () => {
        const base = [
            { id: 1, aaa: 111 },
            { id: 2, aaa: 222 },
            { id: 3, aaa: 333 },
            { id: 4, aaa: 444 },
        ];
        assert.equal(findBy(base, "aaa", 333, true), 2);
    });
    test("should find using a nested property path", () => {
        const base = [
            { id: 1, aaa: 111, bbb: { nested: "aaa" } },
            { id: 2, aaa: 222, bbb: { nested: "bbb" } },
            { id: 3, aaa: 333, bbb: { nested: "ccc" } },
            { id: 4, aaa: 444, bbb: { nested: "ddd" } },
        ];
        assert.equal(findBy(base, "bbb.nested", "ddd"), { id: 4, aaa: 444, bbb: { nested: "ddd" } });
    });
});

group("sortBy", (test) => {
    test("should sort array of objects by provided key", () => {
        const base = [
            { id: 1, aaa: 3 },
            { id: 2, aaa: 2 },
            { id: 3, aaa: 1 },
            { id: 4, aaa: 4 },
        ];
        assert.equal(sortBy(base, "id"), base);
        assert.equal(sortBy(base, "id", "asc"), base);
        assert.equal(sortBy(base, "id", "desc"), base.reverse());
        assert.equal(sortBy(base, "aaa"), [
            { id: 3, aaa: 1 },
            { id: 2, aaa: 2 },
            { id: 1, aaa: 3 },
            { id: 4, aaa: 4 },
        ]);
        assert.equal(sortBy(base, "aaa", "desc"), [
            { id: 4, aaa: 4 },
            { id: 1, aaa: 3 },
            { id: 2, aaa: 2 },
            { id: 3, aaa: 1 },
        ]);
    });

    test("should handle strings & accents", () => {
        const base = [
            { id: 7, aaa: "ûûû" },
            { id: 1, aaa: "ccc" },
            { id: 5, aaa: "ééé" },
            { id: 2, aaa: "bbb" },
            { id: 3, aaa: "aaa" },
            { id: 4, aaa: "eee" },
            { id: 6, aaa: "uuu" },
        ];
        assert.equal(sortBy(base, "aaa"), [
            { id: 3, aaa: "aaa" },
            { id: 2, aaa: "bbb" },
            { id: 1, aaa: "ccc" },
            { id: 4, aaa: "eee" },
            { id: 5, aaa: "ééé" },
            { id: 6, aaa: "uuu" },
            { id: 7, aaa: "ûûû" },
        ]);
        assert.equal(sortBy(base, "aaa", "desc"), [
            { id: 7, aaa: "ûûû" },
            { id: 6, aaa: "uuu" },
            { id: 5, aaa: "ééé" },
            { id: 4, aaa: "eee" },
            { id: 1, aaa: "ccc" },
            { id: 2, aaa: "bbb" },
            { id: 3, aaa: "aaa" },
        ]);
    });
});

test("isEqualArrays should return true if both array contains the same values", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    assert.is(isEqualArrays(ding, ding), true);
    assert.is(isEqualArrays(ding, ding.reverse()), true);
    assert.is(isEqualArrays(ding, dong), false);
});

test("combineUniqueValues should merge every passed array without duplicates", () => {
    const ding = [1, 2, 3, 4, 5];
    const dong = [6, 7, 1, 2, 9];
    const dang = [11, 2, 3, 1, 19, 24, 6];
    assert.equal(combineUniqueValues(ding, ding), ding);
    assert.equal(combineUniqueValues(ding, dong), [1, 2, 3, 4, 5, 6, 7, 9]);
    assert.equal(combineUniqueValues(ding, dong, dang), [1, 2, 3, 4, 5, 6, 7, 9, 11, 19, 24]);
});

test("first", () => {
    assert.is(first([111, 2, 3]), 111);
});

test("last", () => {
    assert.is(last([111, 2, 3]), 3);
});

test("last", () => {
    assert.is(last([111, 2, 3]), 3);
});

test("flatMap", () => {
    assert.equal(
        flatMap(
            [
                [1, 2, 3],
                [4, 5, 6],
            ],
            (value) => value
        ),
        [1, 2, 3, 4, 5, 6]
    );
});

test("makeArrayOf", () => {
    assert.equal(makeArrayOf(5), [0, 0, 0, 0, 0]);
});

test("chunk", () => {
    const arr = [1, 2, 3, 4, 5];
    assert.equal(chunk(arr, 2), [[1, 2], [3, 4], [5]]);
});

test("pluck", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    assert.equal(pluck(arr, "aaa"), [111, 222, 333, 444]);
});

test.run();
