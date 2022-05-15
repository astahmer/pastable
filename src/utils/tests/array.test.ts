import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
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
    uniques,
    uniquesByProp,
    updateAtIndex,
    updateItem,
} from "../array";

test("getDiff should return the difference between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.equal(getDiff(left, right), [3, 4, 5]);
    assert.equal(getDiff(right, left), [6, 7, 9]);
});

test("getSymmetricDiff should return the symmetrical difference between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.equal(getSymmetricDiff(left, right), [3, 4, 5, 6, 7, 9]);
});

test("getUnion should return the union between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.equal(getUnion(left, right), [1, 2, 3, 4, 5, 6, 7, 9]);
});

test("getIntersection should return the intersection between 2 arrays", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.equal(getIntersection(left, right), [1, 2]);
});

group("hasAll", (test) => {
    test("should return false when every values of right are not in left", () => {
        const left = [1, 2, 3, 4, 5];
        const right = [6, 7, 1, 2, 9];
        assert.is(hasAll(left, right), false);
        assert.is(hasAll(right, left), false);
    });
    test("should return true when every values of right are in left", () => {
        const left = [1, 2, 3, 4, 5];
        const right = [6, 7, 1, 2, 3, 4, 5, 9];
        assert.is(hasAll(left, right), false);
        assert.is(hasAll(right, left), true);
    });
});

test("uniques", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.equal(uniques(left.concat(right)), [1, 2, 3, 4, 5, 6, 7, 9]);
});

test("uniquesByProp", () => {
    const base = [
        { id: 1, aaa: 111, bbb: { nested: "aaa" } },
        { id: 2, aaa: 222, bbb: { nested: "bbb" } },
        { id: 3, aaa: 333, bbb: { nested: "ccc" } },
        { id: 4, aaa: 444, bbb: { nested: "ddd" } },
    ];

    // on id
    const firstItemVariant = { ...base[0], id: 1, aaa: 0 };
    assert.equal(uniquesByProp(base.concat(firstItemVariant), "id"), base);
    assert.equal(uniquesByProp([firstItemVariant].concat(base), "id"), [firstItemVariant].concat(base.slice(1)));
    assert.equal(uniquesByProp(base.concat(base), "id"), base);

    // on bbb.nested
    const secondItemVariant = { ...base[1], bbb: { nested: "eee" } };
    const secondItemVariantWithDiffId = { ...base[1], id: 999 };
    assert.equal(uniquesByProp(base.concat(secondItemVariant), "bbb.nested"), base.concat(secondItemVariant));
    assert.equal(uniquesByProp(base.concat(secondItemVariantWithDiffId), "bbb.nested"), base);
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
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    assert.is(isEqualArrays(left, left), true);
    assert.is(isEqualArrays(left, left.reverse()), true);
    assert.is(isEqualArrays(left, right), false);
});

test("combineUniqueValues should merge every passed array without duplicates", () => {
    const left = [1, 2, 3, 4, 5];
    const right = [6, 7, 1, 2, 9];
    const dang = [11, 2, 3, 1, 19, 24, 6];
    assert.equal(combineUniqueValues(left, left), left);
    assert.equal(combineUniqueValues(left, right), [1, 2, 3, 4, 5, 6, 7, 9]);
    assert.equal(combineUniqueValues(left, right, dang), [1, 2, 3, 4, 5, 6, 7, 9, 11, 19, 24]);
});

test("combineUniqueValuesByProps should merge every passed array of objects without duplicates using the given property as identifier", () => {
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
    assert.equal(combineUniqueValuesByProps([left, left], "id"), left);
    assert.equal(combineUniqueValuesByProps([left, right], "id"), left.concat(right[0], right.slice(-1)));

    // on bbb.nested
    assert.equal(combineUniqueValuesByProps([left, left], "bbb.nested"), left);
    assert.equal(combineUniqueValuesByProps([left, right], "bbb.nested"), left.concat(right[0], right[1]));
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

test("appendItem", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(appendItem(arr, 555), [111, 222, 333, 444, 555]);
});

test("prependItem", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(prependItem(arr, 555), [555, 111, 222, 333, 444]);
});

test("updateItem", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    assert.equal(
        updateItem(arr, "id", { id: 3, aaa: 999 }).map((item) => item.aaa),
        [111, 222, 999, 444]
    );
});

test("removeValue", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(removeValue(arr, 333), [111, 222, 444]);
});

test("removeValueMutate", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    removeValueMutate(arr, arr[2]);
    assert.equal(
        arr.map((item) => item.aaa),
        [111, 222, 444]
    );
});

test("removeItem", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    assert.equal(
        removeItem(arr, "id", 3).map((item) => item.aaa),
        [111, 222, 444]
    );
});

test("removeItemMutate", () => {
    const arr = [
        { id: 1, aaa: 111 },
        { id: 2, aaa: 222 },
        { id: 3, aaa: 333 },
        { id: 4, aaa: 444 },
    ];
    removeItemMutate(arr, "id", 3);
    assert.equal(
        arr.map((item) => item.aaa),
        [111, 222, 444]
    );
});

test("updateAtIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(updateAtIndex(arr, 2, 777), [111, 222, 777, 444]);
});

test("removeAtIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(removeAtIndex(arr, 2), [111, 222, 444]);
});

test("removeAtIndexMutate", () => {
    const arr = [111, 222, 333, 444];
    removeAtIndexMutate(arr, 2);
    assert.equal(arr, [111, 222, 444]);
});

test("getPrevItem", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(getPrevItem(arr, 2), 222);
    assert.equal(getPrevItem(arr, 0, false), 111);
    assert.equal(getPrevItem(arr, 0, true), 444);
});

test("getNextItem", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(getNextItem(arr, 2), 444);
    assert.equal(getNextItem(arr, 3, false), 444);
    assert.equal(getNextItem(arr, 3, true), 111);
});

test("getNextIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(getNextIndex(2, arr.length), 3);
    assert.equal(getNextIndex(3, arr.length, false), 3);
    assert.equal(getNextIndex(3, arr.length, true), 0);
});

test("getNextIndex", () => {
    const arr = [111, 222, 333, 444];
    assert.equal(getNextIndex(2, arr.length), 3);
    assert.equal(getNextIndex(3, arr.length, false), 3);
    assert.equal(getNextIndex(3, arr.length, true), 0);
});

test("sortArrayOfObjectByPropFromArray", () => {
    const arr = [
        { id: "1", aaa: 111 },
        { id: "2", aaa: 222 },
        { id: "3", aaa: 333 },
        { id: "4", aaa: 444 },
    ];
    assert.equal(
        sortArrayOfObjectByPropFromArray(arr, "id", ["4", "3", "2", "1"]).map((item) => item.id),
        ["4", "3", "2", "1"]
    );
    assert.equal(
        sortArrayOfObjectByPropFromArray(arr, "aaa", [222, 333, 111, 444]).map((item) => item.aaa),
        [222, 333, 111, 444]
    );
});

test.run();
