import { ObjectLiteral } from "@pastable/typings";

import { isDefined } from "./asserts";
import { getSelf } from "./getters";

/** Pick given properties in object */
export function pick<T, K extends keyof T>(obj: T, paths: K[]): Pick<T, K> {
    return { ...paths.reduce((mem, key) => ({ ...mem, [key]: obj[key] }), {}) } as Pick<T, K>;
}
/** Creates an object composed of the picked object properties that satisfies the condition for each value */
export function pickBy<T, K extends keyof T>(
    obj: T,
    paths: K[],
    fn: (key: keyof T, value: T[keyof T]) => boolean
): Partial<Pick<T, K>> {
    return {
        ...paths.reduce((mem, key) => ({ ...mem, ...(fn(key, obj[key]) ? { [key]: obj[key] } : {}) }), {}),
    } as Pick<T, K>;
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

export type Formater<Value = ObjectLiteral, Return = ObjectLiteral> = (value: Value, key: string) => Return;
/** Keep only truthy values & format them using a given method */
export const format = <Return = ObjectLiteral, Method extends Function = Formater, From = ObjectLiteral>(
    obj: From,
    method: Method = (getSelf as any) as Method
): Return =>
    Object.keys(obj).reduce(
        (acc, key) => ({
            ...acc,
            ...(isDefined(obj[key as keyof typeof obj]) && {
                [key]: method(obj[key as keyof typeof obj], key),
            }),
        }),
        {}
    ) as Return;

// https://github.com/preactjs/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
export function hasShallowDiff(a: Record<any, any>, b: Record<any, any>) {
    for (let i in a) if (!(i in b)) return true;
    for (let i in b) if (a[i] !== b[i]) return true;
    return false;
}

export function getCommonKeys(abc: ObjectLiteral, xyz: ObjectLiteral) {
    const keys = [];
    for (let i in abc) {
        if (i in xyz) {
            keys.push(i);
        }
    }
    return keys;
}

export function hasShallowDiffInCommonKeys(abc: ObjectLiteral, xyz: ObjectLiteral) {
    const commonKeys = getCommonKeys(abc, xyz);
    return hasShallowDiff(pick(abc, commonKeys), pick(xyz, commonKeys));
}
