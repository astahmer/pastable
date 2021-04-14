import { CType, NonFunctionKeys, ObjectLiteral } from "@pastable/typings";

import { get } from "./nested";
import { format } from "./pick";

export const mapper = <Schema = ObjectLiteral, Values = ObjectLiteral>(schema: Schema, obj: Values) =>
    format(Object.entries(schema).reduce((acc, [toKey, fromKey]) => ({ ...acc, [toKey]: get(obj, fromKey) }), {}));

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
