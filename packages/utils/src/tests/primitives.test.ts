import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
import {
    camelToKebab,
    camelToSnake,
    capitalize,
    kebabToCamel,
    limit,
    parseStringAsBoolean,
    snakeToCamel,
    uncapitalize,
} from "../primitives";

group("parseStringAsBoolean", (test) => {
    test("should parse 1 as true", () => {
        assert.is(parseStringAsBoolean("1"), true);
    });
    test('should parse "true" as true', () => {
        assert.is(parseStringAsBoolean("true"), true);
    });
    test("should parse 0 as false", () => {
        assert.is(parseStringAsBoolean("0"), false);
    });
    test('should parse "false" as false', () => {
        assert.is(parseStringAsBoolean("false"), false);
    });
});

test("snakeToCamel", () => {
    const base = "aaa_bbb_ccc-dddEeeFFF";
    assert.equal(snakeToCamel(base), "aaaBbbCcc-dddEeeFFF");
});

test("kebabToCamel", () => {
    const base = "aaa-bbb-ccc_dddEeeFFF";
    assert.equal(kebabToCamel(base), "aaaBbbCcc_dddEeeFFF");
});

test("camelToSnake", () => {
    const base = "aaaBbbCcc-dddEeeFFF";
    assert.equal(camelToSnake(base), "aaa_bbb_ccc-ddd_eee_ff_f");
});

test("camelToKebab", () => {
    const base = "aaa_bbbCcc-dddEeeFFF";
    assert.equal(camelToKebab(base), "aaa_bbb-ccc-ddd-eee-ff-f");
});

test("uncapitalize", () => {
    assert.equal(uncapitalize("abcdef"), "abcdef");
    assert.equal(uncapitalize("Abcdef"), "abcdef");
    assert.equal(uncapitalize("ABCDEF"), "aBCDEF");
});

test("capitalize", () => {
    assert.equal(capitalize("Abcdef"), "Abcdef");
    assert.equal(capitalize("abcdef"), "Abcdef");
    assert.equal(capitalize("ABCDEF"), "ABCDEF");
});

test("limit a number between min/max", () => {
    assert.equal(limit(0, [0, 100]), 0);
    assert.equal(limit(1, [0, 100]), 1);
    assert.equal(limit(-1, [0, 100]), 0);
    assert.equal(limit(100, [0, 100]), 100);
    assert.equal(limit(101, [0, 100]), 100);
});

test.run();
