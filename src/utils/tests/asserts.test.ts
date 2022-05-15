import { it, assert, describe } from "vitest";
import { exclude } from "../array";
import { isClass, isDefined, isObject, isObjectLiteral, isPrimitive, isPromise } from "../asserts";

class Example {}

const types = {
    undefined: undefined as undefined,
    null: null as null,
    emptyString: "",
    string: "abc",
    number: 123,
    zero: 0,
    boolean: true,
    false: false,
    function: () => {},
    classReference: Example,
    classInstance: new Example(),
    object: {},
    array: [] as any[],
    symbol: Symbol(),
    date: new Date(),
    map: new Map(),
    set: new Set(),
    promise: Promise.resolve(),
};

const typeKeys = Object.keys(types) as TypeKey[];

type TypeKey = keyof typeof types;
type AssertConfig = { fn: (value: any) => boolean; truthy: TypeKey[] };

const assertConfigs: AssertConfig[] = [
    { fn: isDefined, truthy: exclude(typeKeys, ["undefined", "null", "emptyString"]) },
    { fn: isPrimitive, truthy: ["emptyString", "string", "number", "boolean", "zero", "false", "undefined", "null"] },
    { fn: isObject, truthy: ["classInstance", "object", "array", "date", "map", "set", "promise"] },
    { fn: isObjectLiteral, truthy: ["object"] },
    { fn: isClass, truthy: ["classReference"] },
    { fn: isPromise, truthy: ["promise"] },
];
const assertFns = assertConfigs.map((config) => config.fn);
const isTrue = (assertName: string, typeKey: TypeKey) =>
    assertConfigs.find((config) => config.fn.name === assertName).truthy.includes(typeKey);

assertFns.map((assertFn) => {
    describe(assertFn.name, () => {
        typeKeys.map((typeKey) =>
            it(`should handle ${typeKey}`, () => {
                assert.equal(assertFn(types[typeKey as keyof typeof types]), isTrue(assertFn.name, typeKey));
            })
        );
    });
});
