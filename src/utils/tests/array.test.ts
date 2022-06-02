import { assert, describe, expect, it } from "vitest";
import {
    appendItem,
    chunk,
    combineUniqueValues,
    combineUniqueValuesByProps,
    exclude,
    findBy,
    first,
    flatMap,
    getDiff,
    getIntersection,
    getNextIndex,
    getNextItem,
    getPrevItem,
    getSymmetricDiff,
    getUnion,
    hasAll,
    isEqualArrays,
    last,
    makeArrayOf,
    pluck,
    prependItem,
    removeAtIndex,
    removeAtIndexMutate,
    removeItem,
    removeItemMutate,
    removeValue,
    removeValueMutate,
    sortArrayOfObjectByPropFromArray,
    sortBy,
    sortListFromRefArray,
    uniques,
    uniquesByProp,
    updateAtIndex,
    updateItem,
} from "../array";

it("getDiff should return the difference between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.deepEqual(getDiff(left, right), [3, 4, 5]);
    assert.deepEqual(getDiff(right, left), [6, 7, 9]);
});

it("getSymmetricDiff should return the symmetrical difference between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.deepEqual(getSymmetricDiff(left, right), [3, 4, 5, 6, 7, 9]);
});

it("getUnion should return the union between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.deepEqual(getUnion(left, right), [1, 2, 3, 4, 5, 6, 7, 9]);
});

it("getIntersection should return the intersection between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.deepEqual(getIntersection(left, right), [1, 2]);
});

describe("hasAll", (test) => {
    it("should return false when every values of right are not in left", () => {
        const left = [1, 2, 3, 4, 5];
        const right = [6, 7, 1, 2, 9];
        assert.deepEqual(hasAll(left, right), false);
        assert.deepEqual(hasAll(right, left), false);
    });
    it("should return true when every values of right are in left", () => {
        const left = [1, 2, 3, 4, 5];
        const right = [6, 7, 1, 2, 3, 4, 5, 9];
        assert.deepEqual(hasAll(left, right), false);
        assert.deepEqual(hasAll(right, left), true);
    });
});

it("uniques", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.deepEqual(uniques(left.concat(right)), [1, 2, 3, 4, 5, 6, 7, 9]);
});

it("uniquesByProp", () => {
    const base = [
        { id: 1, aaa: 111, bbb: { nested: "aaa" } },
        { id: 2, aaa: 222, bbb: { nested: "bbb" } },
        { id: 3, aaa: 333, bbb: { nested: "ccc" } },
        { id: 4, aaa: 444, bbb: { nested: "ddd" } },
    ];

    // on id
    const firstItemVariant = { ...base[0], id: 1, aaa: 0 };
    assert.deepEqual(uniquesByProp(base.concat(firstItemVariant), "id"), base);
    assert.deepEqual(uniquesByProp([firstItemVariant].concat(base), "id"), [firstItemVariant].concat(base.slice(1)));
    assert.deepEqual(uniquesByProp(base.concat(base), "id"), base);

    // on bbb.nested
    const secondItemVariant = { ...base[1], bbb: { nested: "eee" } };
    const secondItemVariantWithDiffId = { ...base[1], id: 999 };
    assert.deepEqual(uniquesByProp(base.concat(secondItemVariant), "bbb.nested"), base.concat(secondItemVariant));
    assert.deepEqual(uniquesByProp(base.concat(secondItemVariantWithDiffId), "bbb.nested"), base);
});

it("exclude should return base array without excluded items", () => {
    const base = [1, 2, 3, 4, 5];
    const excluded = [3, 5];
    assert.deepEqual(exclude(base, excluded), [1, 2, 4]);
});

describe("findBy", (test) => {
    it("should find an object from a value and its property path", () => {
        const base = [
            { id: 1, aaa: 111 },
            { id: 2, aaa: 222 },
            { id: 3, aaa: 333 },
            { id: 4, aaa: 444 },
        ];
        assert.deepEqual(findBy(base, "aaa", 333), { id: 3, aaa: 333 });
    });
    it("should return the index if provided bool", () => {
        const base = [
            { id: 1, aaa: 111 },
            { id: 2, aaa: 222 },
            { id: 3, aaa: 333 },
            { id: 4, aaa: 444 },
        ];
        assert.deepEqual(findBy(base, "aaa", 333, true), 2);
    });
    it("should find using a nested property path", () => {
        const base = [
            { id: 1, aaa: 111, bbb: { nested: "aaa" } },
            { id: 2, aaa: 222, bbb: { nested: "bbb" } },
            { id: 3, aaa: 333, bbb: { nested: "ccc" } },
            { id: 4, aaa: 444, bbb: { nested: "ddd" } },
        ];
        assert.deepEqual(findBy(base, "bbb.nested", "ddd"), { id: 4, aaa: 444, bbb: { nested: "ddd" } });
    });
});

describe("sortBy", (test) => {
    it("should sort array of objects by provided key", () => {
        const base = [
            { id: 1, aaa: 3 },
            { id: 2, aaa: 2 },
            { id: 3, aaa: 1 },
            { id: 4, aaa: 4 },
        ];
        assert.deepEqual(sortBy(base, "id"), base);
        assert.deepEqual(sortBy(base, "id", "asc"), base);
        assert.deepEqual(sortBy(base, "id", "desc"), base.reverse());
        assert.deepEqual(sortBy(base, "aaa"), [
            { id: 3, aaa: 1 },
            { id: 2, aaa: 2 },
            { id: 1, aaa: 3 },
            { id: 4, aaa: 4 },
        ]);
        assert.deepEqual(sortBy(base, "aaa", "desc"), [
            { id: 4, aaa: 4 },
            { id: 1, aaa: 3 },
            { id: 2, aaa: 2 },
            { id: 3, aaa: 1 },
        ]);
    });

    it("should handle strings & accents", () => {
        const base = [
            { id: 7, aaa: "ûûû" },
            { id: 1, aaa: "ccc" },
            { id: 5, aaa: "ééé" },
            { id: 2, aaa: "bbb" },
            { id: 3, aaa: "aaa" },
            { id: 4, aaa: "eee" },
            { id: 6, aaa: "uuu" },
        ];
        assert.deepEqual(sortBy(base, "aaa"), [
            { id: 3, aaa: "aaa" },
            { id: 2, aaa: "bbb" },
            { id: 1, aaa: "ccc" },
            { id: 4, aaa: "eee" },
            { id: 5, aaa: "ééé" },
            { id: 6, aaa: "uuu" },
            { id: 7, aaa: "ûûû" },
        ]);
        assert.deepEqual(sortBy(base, "aaa", "desc"), [
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

it("isEqualArrays should return true if both array contains the same values", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.deepEqual(isEqualArrays(left, left), true);
    assert.deepEqual(isEqualArrays(left, left.reverse()), true);
    assert.deepEqual(isEqualArrays(left, right), false);
});

it("combineUniqueValues should merge every passed array without duplicates", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    const dang = [11, 2, 3, 1, 19, 24, 6];
    assert.deepEqual(combineUniqueValues(left, left), left);
    assert.deepEqual(combineUniqueValues(left, right), [1, 2, 3, 4, 5, 6, 7, 9]);
    assert.deepEqual(combineUniqueValues(left, right, dang), [1, 2, 3, 4, 5, 6, 7, 9, 11, 19, 24]);
});

it("combineUniqueValuesByProps should merge every passed array of objects without duplicates using the given property as identifier", () => {
    const left = [
        { id: 1, aaa: 111, bbb: { nested: "aaa" } },
        { id: 2, aaa: 222, bbb: { nested: "bbb" } },
        { id: 3, aaa: 333, bbb: { nested: "ccc" } },
        { id: 4, aaa: 444, bbb: { nested: "ddd" } },
    ];
    const right = [
        { id: 9, aaa: 111, bbb: { nested: "zzz" } },
        { id: 2, aaa: 222, bbb: { nested: "yyy" } },
        { id: 3, aaa: 333, bbb: { nested: "ccc" } },
        { id: 8, aaa: 444, bbb: { nested: "ddd" } },
    ];

    // on id
    assert.deepEqual(combineUniqueValuesByProps([left, left], "id"), left);
    assert.deepEqual(combineUniqueValuesByProps([left, right], "id"), left.concat(right[0], right.slice(-1)));

    // on bbb.nested
    assert.deepEqual(combineUniqueValuesByProps([left, left], "bbb.nested"), left);
    assert.deepEqual(combineUniqueValuesByProps([left, right], "bbb.nested"), left.concat(right[0], right[1]));
});

it("first", () => {
    assert.deepEqual(first([111, 2, 3]), 111);
});

it("last", () => {
    assert.deepEqual(last([111, 2, 3]), 3);
});

it("last", () => {
    assert.deepEqual(last([111, 2, 3]), 3);
});

it("flatMap", () => {
    assert.deepEqual(
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

it("makeArrayOf", () => {
    assert.deepEqual(makeArrayOf(5), [0, 0, 0, 0, 0]);
});

it("chunk", () => {
    const arr = [1, 2, 3, 4, 5];
    assert.deepEqual(chunk(arr, 2), [[1, 2], [3, 4], [5]]);
});

it("pluck", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    assert.deepEqual(pluck(arr, "aaa"), [111, 222, 333, 444]);
});

it("appendItem", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(appendItem(arr, 555), [111, 222, 333, 444, 555]);
});

it("prependItem", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(prependItem(arr, 555), [555, 111, 222, 333, 444]);
});

it("updateItem", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    assert.deepEqual(
        updateItem(arr, "id", { id: 3, aaa: 999 }).map((item) => item.aaa),
        [111, 222, 999, 444]
    );
});

it("removeValue", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(removeValue(arr, 333), [111, 222, 444]);
});

it("removeValueMutate", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    removeValueMutate(arr, arr[2]);
    assert.deepEqual(
        arr.map((item) => item.aaa),
        [111, 222, 444]
    );
});

it("removeItem", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    assert.deepEqual(
        removeItem(arr, "id", 3).map((item) => item.aaa),
        [111, 222, 444]
    );
});

it("removeItemMutate", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    removeItemMutate(arr, "id", 3);
    assert.deepEqual(
        arr.map((item) => item.aaa),
        [111, 222, 444]
    );
});

it("updateAtIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(updateAtIndex(arr, 2, 777), [111, 222, 777, 444]);
});

it("removeAtIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(removeAtIndex(arr, 2), [111, 222, 444]);
});

it("removeAtIndexMutate", () => {
    const arr = [111, 222, 333, 444];
    removeAtIndexMutate(arr, 2);
    assert.deepEqual(arr, [111, 222, 444]);
});

it("getPrevItem", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(getPrevItem(arr, 2), 222);
    assert.deepEqual(getPrevItem(arr, 0, false), 111);
    assert.deepEqual(getPrevItem(arr, 0, true), 444);
});

it("getNextItem", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(getNextItem(arr, 2), 444);
    assert.deepEqual(getNextItem(arr, 3, false), 444);
    assert.deepEqual(getNextItem(arr, 3, true), 111);
});

it("getNextIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(getNextIndex(2, arr.length), 3);
    assert.deepEqual(getNextIndex(3, arr.length, false), 3);
    assert.deepEqual(getNextIndex(3, arr.length, true), 0);
});

it("getNextIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.deepEqual(getNextIndex(2, arr.length), 3);
    assert.deepEqual(getNextIndex(3, arr.length, false), 3);
    assert.deepEqual(getNextIndex(3, arr.length, true), 0);
});

it("sortArrayOfObjectByPropFromArray", () => {
    const arr = [
        { id: "1", aaa: 111 },
        { id: "2", aaa: 222 },
        { id: "3", aaa: 333 },
        { id: "4", aaa: 444 },
    ];
    assert.deepEqual(
        sortArrayOfObjectByPropFromArray(arr, "id", ["4", "3", "2", "1"]).map((item) => item.id),
        ["4", "3", "2", "1"]
    );
    assert.deepEqual(
        sortArrayOfObjectByPropFromArray(arr, "aaa", [222, 333, 111, 444]).map((item) => item.aaa),
        [222, 333, 111, 444]
    );
});

it("sortListFromRefArray", () => {
    const arr = ["1", "2", "3", "4"];
    assert.deepEqual(sortListFromRefArray(arr, ["4", "3", "2", "1"]), ["4", "3", "2", "1"]);
});
