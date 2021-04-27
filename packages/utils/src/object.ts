import { CType, NonFunctionKeys, ObjectLiteral } from "@pastable/typings";

import { isObjectLiteral } from "./asserts";
import { get } from "./nested";
import { format } from "./pick";

/** Map an object to another using given schema, can use a dot delimited path for mapping to nested properties */
export const mapper = <Schema = ObjectLiteral, Values = ObjectLiteral>(schema: Schema, obj: Values) =>
    format(Object.entries(schema).reduce((acc, [toKey, fromKey]) => ({ ...acc, [toKey]: get(obj, fromKey) }), {}));

/** Reverse an object from its schema */
export const reverse = <Schema = ObjectLiteral>(schema: Schema) =>
    Object.entries(schema).reduce((acc, [fromKey, toKey]) => ({ ...acc, [toKey]: fromKey }), {});

/** Make an instance of given class auto-filled with record values */
export const makeInstance = <Instance extends object>(
    instance: CType<Instance>,
    record: Partial<{ [Key in NonFunctionKeys<Instance>]: Instance[Key] }>
) => {
    const item = new instance();
    const entries = Object.entries(record);

    entries.forEach(([key, value]) => (item[key as keyof Instance] = value as Instance[keyof Instance]));

    return item;
};

/** Polyfill Object.fromEntries */
export function fromEntries<K extends string, V>(iterable: Iterable<readonly [K, V]> | Array<[K, V]>): Record<K, V> {
    return [...iterable].reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
    }, {} as Record<K, V>);
}

/** Sort object keys alphabetically */
export const sortObjectKeys = (obj: ObjectLiteral) =>
    Object.keys(obj)
        .sort()
        .reduce((acc, key) => ((acc[key] = obj[key]), acc), {} as ObjectLiteral);

/**
 * Hashes the value into a stable hash.
 * @see Adapted from https://github.com/tannerlinsley/react-query/blob/e42cbc32dfcd9add24cadd06135e42af1dbbc8ad/src/core/utils.ts
 */
export function hash<T extends ObjectLiteral = ObjectLiteral>(value: T): string {
    return JSON.stringify(value, (_, val) => (isObjectLiteral(val) ? sortObjectKeys(val) : val));
}
