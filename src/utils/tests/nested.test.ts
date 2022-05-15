import { assert, describe, it } from "vitest";
import { deepMerge, deepSort, get, remove, set } from "../nested";

it("set allows setting a value on a nested property path", () => {
    const ref = { parent: { child: { status: false } } };
    assert.deepEqual(ref.parent.child.status, false);

    set(ref, "parent.another.nested", "aaa");
    set(ref, "parent.child.status", true);
    set(ref, "parent.child.newKey", "new");
    assert.deepEqual((ref.parent as any).another.nested, "aaa");
    assert.deepEqual((ref.parent.child as any).newKey, "new");
    assert.deepEqual(ref.parent.child.status, true);
});

it("get allows getting a value on a nested property path", () => {
    const ref = { parent: { child: { status: false } } };
    assert.deepEqual(ref.parent.child.status, false);

    assert.deepEqual(get(ref, "parent.child.status"), false);
});

it("remove allows removing a value on a nested property path", () => {
    const ref = { parent: { child: { status: false } } };
    assert.deepEqual(ref.parent.child.status, false);

    remove(ref, "parent.child.status");
    assert.deepEqual(ref.parent.child.status, undefined);
    assert.deepEqual(ref.parent.child !== undefined, true);
});

describe("deepMerge", (test) => {
    it("should merges values deeply", () => {
        const first = { parent: { child: { status: false } } };
        const second = { parent: { child: { status: true, aaa: 123 }, bbb: 456 } };
        const third = { parent: { child: { aaa: 999, ccc: 888 }, ddd: 777 }, eee: 555 };

        const result = deepMerge([first, second, third]);
        assert.deepEqual(result, {
            parent: { child: { status: true, aaa: 999, ccc: 888 }, bbb: 456, ddd: 777 } as any,
            eee: 555,
        });
    });
    it("should only merge objects passed as argument", () => {
        const first = { parent: { child: { status: false } } };
        const second = { parent: { child: { status: true, aaa: 123 }, bbb: 456 } };
        const third = { parent: { child: { aaa: 999, ccc: 888 }, ddd: 777 }, eee: 555 };

        const result = deepMerge([first, second, third, "aaa", 111, false] as any);
        assert.deepEqual(result, {
            parent: { child: { status: true, aaa: 999, ccc: 888 }, bbb: 456, ddd: 777 },
            eee: 555,
        });
    });
    it("should return null if nothing to merge", () => {
        const result = deepMerge(["aaa", 111, false] as any);
        assert.deepEqual(result, null);
    });
    it("should merge nested array with unique values only", () => {
        const first = { parent: { arr: [1, 2, 3, 4] } };
        const second = { parent: { arr: [3, 4, 5, 6] } };

        assert.deepEqual(deepMerge([first, second]), {
            parent: { arr: [1, 2, 3, 4, 3, 4, 5, 6] },
        });
        assert.deepEqual(deepMerge([first, second], { withUniqueArrayValues: true }), {
            parent: { arr: [1, 2, 3, 4, 5, 6] },
        });
    });
});

it("deepSort", () => {
    const third = {
        parent: { child: { zzz: 111, aaa: 999, ccc: 888 }, aaa: "aaa", ddd: 777, bbb: "bbb" },
        hhh: "hhh",
        eee: 555,
        jjj: "jjj",
    };
    assert.deepEqual(deepSort(third), {
        eee: 555,
        hhh: "hhh",
        jjj: "jjj",
        parent: {
            aaa: "aaa",
            bbb: "bbb",
            child: { aaa: 999, ccc: 888, zzz: 111 },
            ddd: 777,
        },
    });
});
