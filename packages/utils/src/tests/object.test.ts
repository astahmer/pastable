import { test } from "uvu";
import assert from "uvu/assert";

import { fromEntries, hash, makeInstance, mapper, reverse, sortObjectKeys } from "../object";

test("mapper", () => {
    const schema = {
        destination: "target",
        toKey: "fromKey",
        camelCase: "snake_case",
        nested: "deep.value",
    };

    const values = { target: 111, fromKey: "aaa", snake_case: "sss", deep: { value: "yes" } };
    assert.equal(mapper(schema, values), {
        destination: 111,
        toKey: "aaa",
        camelCase: "sss",
        nested: "yes",
    });
});

test("reverse", () => {
    const schema = {
        destination: "target",
        toKey: "fromKey",
        camelCase: "snake_case",
        nested: "deep.value",
    };

    const values = { target: 111, fromKey: "aaa", snake_case: "sss", deep: { value: "yes" } };
    const mappedValues = mapper(schema, values);
    const reversedSchema = reverse(schema);

    assert.equal(reversedSchema, {
        target: "destination",
        fromKey: "toKey",
        snake_case: "camelCase",
        "deep.value": "nested",
    });
    assert.equal(mapper(reversedSchema, mappedValues), {
        target: 111,
        fromKey: "aaa",
        snake_case: "sss",
        "deep.value": "yes",
    });
});

test("makeInstance", () => {
    class Example {
        aaa: string;
        zzz: string;
    }
    const expected = new Example();
    expected.aaa = "yes";
    expected.zzz = "no";

    assert.equal(makeInstance(Example, { aaa: "yes", zzz: "no" }), expected);
});

test("fromEntries", () => {
    const entries = [
        ["aaa", 123],
        ["zzz", 456],
    ] as const;

    assert.equal(fromEntries(entries), Object.fromEntries(entries));
});

test("sortObjectKeys", () => {
    const base = { zzz: 111, aaa: 222, ddd: 333, ccc: 444, eee: 555 };
    const expected = { aaa: 222, ccc: 444, ddd: 333, eee: 555, zzz: 111 };

    assert.equal(sortObjectKeys(base), expected);
});

test("hash returns the value into a stable hash", () => {
    const sorted = { aaa: 222, ccc: 444, ddd: 333, eee: 555, zzz: 111 };
    const unsorted = { zzz: 111, aaa: 222, ddd: 333, ccc: 444, eee: 555 };

    assert.equal(hash(sorted), '{"aaa":222,"ccc":444,"ddd":333,"eee":555,"zzz":111}');
    assert.equal(hash(sorted), hash(unsorted));

    const primitivesArray = ["a", "b", "c"];
    const objArray = [sorted, unsorted];
    const withNested = { zzz: 999, obj: { yyy: 888, nested: { primitivesArray, objArray } } };
    assert.equal(
        hash(withNested),
        `{"obj":{"nested":{"objArray":[{"aaa":222,"ccc":444,"ddd":333,"eee":555,"zzz":111},{"aaa":222,"ccc":444,"ddd":333,"eee":555,"zzz":111}],"primitivesArray":["a","b","c"]},"yyy":888},"zzz":999}`
    );
});

test.run();
