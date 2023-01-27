import { ObjectLiteral } from "../typings";

import { isDefined } from "./asserts";
import { getSelf } from "./getters";

/** Pick given properties in object */
export function pick<T, K extends keyof T>(obj: T, paths: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;

    Object.keys(obj).forEach((key) => {
        if (!paths.includes(key as K)) return;
        // @ts-expect-error
        result[key] = obj[key];
    });

    return result as Pick<T, K>;
}
/** Creates an object composed of the picked object properties that satisfies the condition for each value */
export function pickBy<T, K extends keyof T>(
    obj: T,
    paths: K[],
    fn: (key: keyof T, value: T[keyof T]) => boolean
): Partial<Pick<T, K>> {
    const result = {} as Pick<T, K>;

    Object.keys(obj).forEach((key) => {
        if (!paths.includes(key as K)) return;
        // @ts-expect-error
        if (!fn(key, obj[key])) return;
        // @ts-expect-error
        result[key] = obj[key];
    });

    return result as Pick<T, K>;
}

/** Only pick given properties that are defined in object */
export const pickDefined = <T, K extends keyof T>(obj: T, paths: K[]) =>
    pickBy(obj, paths, (_key, value) => isDefined(value));

/** Omit given properties from object */
export function omit<T extends ObjectLiteral, K extends keyof T>(object: T, keys: K[]) {
    const result: ObjectLiteral = {};

    Object.keys(object).forEach((key) => {
        if (keys.includes(key as K)) return;
        result[key] = object[key];
    });

    return result as Omit<T, K>;
}

export type Formater<Value = any, Return = any, Key extends any = string> = (value: Value, key: Key) => Return;
/** Format object values using a given method */
export const format = <Return = ObjectLiteral, Method extends Function = Formater, From = ObjectLiteral>(
    obj: From,
    method: Method = getSelf as any as Method
): Return =>
    Object.keys(obj).reduce((acc, key) => ({ ...acc, [key]: method(obj[key as keyof typeof obj], key) }), {}) as Return;

/** Remove undefined properties in object */
export const removeUndefineds = <Value = ObjectLiteral>(obj: Value) =>
    Object.keys(obj).reduce(
        (acc, key) => ({
            ...acc,
            ...(isDefined(obj[key as keyof typeof obj]) && {
                [key]: obj[key as keyof typeof obj],
            }),
        }),
        {}
    );

/**
 * Returns true if a value differs between a & b, only check for the first level (shallow)
 * @see https://github.com/preactjs/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
 */
export function hasShallowDiff(a: Record<any, any>, b: Record<any, any>) {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
}

/** Returns keys that are both in a & b */
export function getCommonKeys(abc: ObjectLiteral, xyz: ObjectLiteral) {
    const keys = [];
    for (let i in abc) {
        if (i in xyz) {
            keys.push(i);
        }
    }
    return keys;
}

/** Returns true if a value differs between a & b in their common properties */
export function hasShallowDiffInCommonKeys(abc: ObjectLiteral, xyz: ObjectLiteral) {
    const commonKeys = getCommonKeys(abc, xyz);
    return hasShallowDiff(pick(abc, commonKeys), pick(xyz, commonKeys));
}
