import { test } from "uvu";
import assert from "uvu/assert";

import { group } from "../_uvu";
import {
    camelToKebab,
    camelToSnake,
    capitalize,
    forceInt,
    getPageCount,
    getSum,
    kebabToCamel,
    limit,
    parseStringAsBoolean,
    roundTo2decimals,
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

test("getSum", () => {
    assert.equal(getSum([1, 2, 3]), 6);
});

test("forceInt", () => {
    assert.equal(forceInt("4"), 4);
    assert.equal(forceInt(NaN), 1);
    assert.equal(forceInt(NaN, 7), 7);
});

test("getPageCount", () => {
    assert.equal(getPageCount(9, 10), 1);
    assert.equal(getPageCount(10, 10), 1);
    assert.equal(getPageCount(11, 10), 2);
});

test("roundTo2decimals", () => {
    assert.equal(roundTo2decimals(1.11), 1.11);
    assert.equal(roundTo2decimals(1.15), 1.15);
    assert.equal(roundTo2decimals(1.151), 1.15);
    assert.equal(roundTo2decimals(1.155), 1.16);
    assert.equal(roundTo2decimals(1.156), 1.16);
});

test.run();
