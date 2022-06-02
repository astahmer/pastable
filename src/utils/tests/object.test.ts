import { assert, expect, it, vi } from "vitest";
import {
    fromEntries,
    hash,
    makeInstance,
    mapper,
    mergeProps,
    reverse,
    sortObjectKeys,
    sortObjKeysFromArray,
} from "../object";

it("mapper", () => {
    const schema = {
        destination: "target",
        toKey: "fromKey",
        camelCase: "snake_case",
        nested: "deep.value",
    };

    const values = { target: 111, fromKey: "aaa", snake_case: "sss", deep: { value: "yes" } };
    assert.deepEqual(mapper(schema, values), {
        destination: 111,
        toKey: "aaa",
        camelCase: "sss",
        nested: "yes",
    });
});

it("reverse", () => {
    const schema = {
        destination: "target",
        toKey: "fromKey",
        camelCase: "snake_case",
        nested: "deep.value",
    };

    const values = { target: 111, fromKey: "aaa", snake_case: "sss", deep: { value: "yes" } };
    const mappedValues = mapper(schema, values);
    const reversedSchema = reverse(schema);

    assert.deepEqual(reversedSchema, {
        target: "destination",
        fromKey: "toKey",
        snake_case: "camelCase",
        "deep.value": "nested",
    });
    assert.deepEqual(mapper(reversedSchema, mappedValues), {
        target: 111,
        fromKey: "aaa",
        snake_case: "sss",
        "deep.value": "yes",
    });
});

it("makeInstance", () => {
    class Example {
        aaa: string;
        zzz: string;
    }
    const expected = new Example();
    expected.aaa = "yes";
    expected.zzz = "no";

    assert.deepEqual(makeInstance(Example, { aaa: "yes", zzz: "no" }), expected);
});

it("fromEntries", () => {
    const entries = [
        ["aaa", 123],
        ["zzz", 456],
    ] as const;

    assert.deepEqual(fromEntries(entries), Object.fromEntries(entries));
});

it("sortObjectKeys", () => {
    const base = { zzz: 111, aaa: 222, ddd: 333, ccc: 444, eee: 555 };
    const expected = { aaa: 222, ccc: 444, ddd: 333, eee: 555, zzz: 111 };

    assert.deepEqual(sortObjectKeys(base), expected);
});

it("hash returns the value into a stable hash", () => {
    const sorted = { aaa: 222, ccc: 444, ddd: 333, eee: 555, zzz: 111 };
    const unsorted = { zzz: 111, aaa: 222, ddd: 333, ccc: 444, eee: 555 };

    assert.deepEqual(hash(sorted), '{"aaa":222,"ccc":444,"ddd":333,"eee":555,"zzz":111}');
    assert.deepEqual(hash(sorted), hash(unsorted));

    const primitivesArray = ["a", "b", "c"];
    const objArray = [sorted, unsorted];
    const withNested = { zzz: 999, obj: { yyy: 888, nested: { primitivesArray, objArray } } };
    assert.deepEqual(
        hash(withNested),
        `{"obj":{"nested":{"objArray":[{"aaa":222,"ccc":444,"ddd":333,"eee":555,"zzz":111},{"aaa":222,"ccc":444,"ddd":333,"eee":555,"zzz":111}],"primitivesArray":["a","b","c"]},"yyy":888},"zzz":999}`
    );
});

it("sortObjKeysFromArray", () => {
    const base = { zzz: 111, aaa: 222, ddd: 333, ccc: 444, eee: 555 };
    const order = ["aaa", "zzz", "ddd", "eee", "ccc"];
    assert.deepEqual(Object.keys(sortObjKeysFromArray(base, order as any)), order);
});

it("mergeProps", () => {
    let count = 0;

    const first = { onChange: vi.fn(() => count++) };
    const second = { onChange: vi.fn(() => count++) };
    const merged = mergeProps(first, second);

    expect(Object.keys(merged)).toEqual(["onChange"]);

    merged.onChange();

    expect(first.onChange.mock.calls.length).toBe(1);
    expect(second.onChange.mock.calls.length).toBe(1);
    expect(count).toBe(2);
});
