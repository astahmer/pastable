import type { AnyFunction, ObjectLiteral } from "../typings";

import { isDate, isObject, isObjectLiteral } from "./asserts";
import { getSetUnion } from "./set";

/** Sets a nested property value from a dot-delimited path */
export function set<Value = any, From = ObjectLiteral>(obj: From, path: string, value: Value): void;
/** Sets a nested property value using a getter that points to the parent prop on which the value will be set */
export function set<Value = any, From = ObjectLiteral>(
    obj: From,
    getter: (value: From) => any,
    prop: string,
    value: Value
): void;
export function set<Value = any, From = ObjectLiteral>(
    obj: From,
    pathOrGetter: string | ((obj: From) => any),
    valueOrProp: Value | string,
    value?: Value
): void {
    if (typeof pathOrGetter === "function") {
        const parent = pathOrGetter(obj);
        if (parent) {
            parent[valueOrProp] = value;
        }
        return;
    }

    if (pathOrGetter.includes(".")) {
        let target = obj as any;
        const props = pathOrGetter.split(".");
        for (let i = 0, len = props.length; i < len; ++i) {
            if (i + 1 < len) {
                if (target[props[i]] === undefined || target[props[i]] === null) {
                    target = target[props[i]] = {};
                } else {
                    target = target[props[i]];
                }
            } else {
                target[props[i]] = valueOrProp;
            }
        }
        return;
    }

    (obj as any)[pathOrGetter] = value;
}

export const makeGetter = <Return = any, From = ObjectLiteral>(path: string): ((obj: From) => Return) => {
    if (path.includes(".")) {
        return new Function("obj", "propPath", "value", "return obj." + path) as AnyFunction<Return, From>;
    }

    return (obj: From) => (obj as any)[path] as Return;
};

/** Get a nested property value from a dot-delimited path. */
export function get<Return = any, From = ObjectLiteral>(obj: From, path: string): Return {
    let target = obj || {};
    const props = path.split(".");
    for (let i = 0, len = props.length; i < len; ++i) {
        target = target[props[i] as keyof typeof target];
        if (target === undefined || target === null) {
            break;
        }
    }

    return target as Return;
}

/** Remove key at path in an object */
export function remove<From = ObjectLiteral>(obj: From, path: string) {
    let target = obj;
    const props = path.split(".");
    for (let i = 0, len = props.length; i < len; ++i) {
        if (i < len - 1) {
            target = target[props[i] as keyof typeof target] as any;
            if (undefined === target) {
                break;
            }
        } else {
            delete target[props[i] as keyof typeof target];
        }
    }
}

type TUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/** Deep merge arrays from left into right, can use unique array values for merged properties */
export function deepMerge<T extends ObjectLiteral[]>(
    inputs: Partial<T>,
    options?: DeepMergeOptions
): TUnionToIntersection<T[number]> {
    const objects = inputs.filter(isObjectLiteral);
    let target = objects.shift();

    if (!target) return null;
    if (!objects.length) return target as TUnionToIntersection<T[number]>;

    function deepMergeInner(target: ObjectLiteral, source: ObjectLiteral, options: DeepMergeOptions) {
        Object.keys(source).forEach((key: string) => {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                target[key] = options?.withUniqueArrayValues
                    ? Array.from(getSetUnion(new Set(targetValue), new Set(sourceValue)))
                    : targetValue.concat(sourceValue);
            } else if (isObject(targetValue) && isObject(sourceValue)) {
                target[key] = deepMergeInner(Object.assign({}, targetValue), sourceValue, options);
            } else {
                target[key] = sourceValue;
            }
        });

        return target;
    }

    let source;
    while ((source = objects.shift())) {
        deepMergeInner(target, source, options);
    }

    return target as TUnionToIntersection<T[number]>;
}

export type DeepMergeOptions = { withUniqueArrayValues?: boolean };

// Adapted from https://github.com/IndigoUnited/js-deep-sort-object/blob/master/index.js
const defaultSortFn = (a: string, b: string) => a.localeCompare(b);
export type ComparatorFn = (a: string, b: string) => number;

/** Deeply sort an object's properties using given sort function */
export function deepSort<T>(src: T, comparator: ComparatorFn = defaultSortFn): T {
    function deepSortInner(src: ObjectLiteral, comparator: ComparatorFn): ObjectLiteral | ObjectLiteral[] {
        if (Array.isArray(src)) {
            return src.map((item) => deepSort(item, comparator));
        }

        if (isObject(src) && !isDate(src)) {
            const out: ObjectLiteral = {};
            Object.keys(src)
                .sort(comparator)
                .forEach((key) => (out[key as keyof typeof out] = deepSort(src[key as keyof typeof src], comparator)));

            return out;
        }

        return src;
    }

    return deepSortInner(src, comparator) as T;
}
