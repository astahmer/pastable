import { CType, NonFunctionKeys, ObjectLiteral } from "../typings";

import { isObjectLiteral } from "./asserts";
import { callAll } from "./misc";
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
export const sortObjectKeys = <T = ObjectLiteral>(obj: T) =>
    Object.keys(obj)
        .sort()
        .reduce((acc, key) => ((acc[key as keyof T] = obj[key as keyof T]), acc), {} as T);

/** Sort object keys using a reference order array, sort keys not in reference order in lasts positions */
export const sortObjKeysFromArray = <T = ObjectLiteral>(obj: T, orderedKeys: Array<keyof T>) => {
    const entries = Object.entries(obj) as Array<[keyof T, T[keyof T]]>;

    const sortedEntries = entries
        .filter(([key]) => orderedKeys.includes(key))
        .sort(([a], [b]) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b))
        .concat(entries.filter(([key]) => !orderedKeys.includes(key)));
    return Object.fromEntries(sortedEntries);
};

/**
 * Hashes the value into a stable hash.
 * @see Adapted from https://github.com/tannerlinsley/react-query/blob/e42cbc32dfcd9add24cadd06135e42af1dbbc8ad/src/core/utils.ts
 */
export function hash<T extends ObjectLiteral = ObjectLiteral>(value: T): string {
    return JSON.stringify(value, (_, val) => (isObjectLiteral(val) ? sortObjectKeys(val) : val));
}
export function groupBy<Key extends keyof T, T extends ObjectLiteral>(
    array: T[],
    keyOrGetter: Key
): Record<T[Key], T[]>;
export function groupBy<T, KeyReturnT>(
    array: T[],
    keyOrGetter: (item: T) => KeyReturnT
): KeyReturnT extends string | number ? Record<KeyReturnT, T[]> : never;
export function groupBy<Key, T>(array: T[], keyOrGetter: Key) {
    let kv;
    return array.reduce((r, a) => {
        kv = typeof keyOrGetter === "function" ? keyOrGetter(a) : a[keyOrGetter as unknown as keyof T];
        // @ts-ignore
        r[kv] = [...(r[kv] || []), a];
        return r;
    }, {});
}

export function groupIn<Key extends keyof T, T extends ObjectLiteral>(array: T[], keyOrGetter: Key): Record<T[Key], T>;
export function groupIn<T, KeyReturnT>(
    array: T[],
    keyOrGetter: (item: T) => KeyReturnT
): KeyReturnT extends string | number ? Record<KeyReturnT, T> : never;
export function groupIn<Key, T>(array: T[], keyOrGetter: Key) {
    let kv;
    return array.reduce((r, a) => {
        kv = typeof keyOrGetter === "function" ? keyOrGetter(a) : a[keyOrGetter as unknown as keyof T];
        // @ts-ignore
        r[kv] = a;
        return r;
    }, {});
}

export const mergeProps = <Left extends ObjectLiteral, Right extends Partial<Left & {}>>(left: Left, right: Right) => {
    const result = { ...left, ...right };
    for (const key in result) {
        if (typeof left[key] === "function" && typeof right[key] === "function") {
            (result as any)[key] = callAll(left[key], right[key]);
        }
    }
    return result;
};

// https://github.dev/statelyai/xstate/blob/144131beda5c00a15fbe0f58a3309eac81d940eb/packages/core/src/utils.ts#L39
export function keys<T extends object>(value: T): Array<keyof T & string> {
    return Object.keys(value) as Array<keyof T & string>;
}
