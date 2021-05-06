import { ObjectLiteral, PrimitiveValue } from "@pastable/typings";

import { get } from "./nested";
import { getSetDifference, getSetIntersection, getSetUnion, getSymmetricDifference, isSuperset } from "./set";

/**
 * Return the difference between left in right
 * @example getDiff([1, 2, 3], [1, 4, 5]) -> [2, 3]
 */
export const getDiff = <T = any>(ding: Array<T>, dong: Array<T>) =>
    Array.from(getSetDifference(new Set(ding), new Set(dong)));

/**
 * Return the difference between left in right / right in left
 * @example getSymmetricDiff([1, 2, 3], [1, 4, 5]) -> [2, 3, 4, 5]
 */
export const getSymmetricDiff = <T = any>(ding: Array<T>, dong: Array<T>) =>
    Array.from(getSymmetricDifference(new Set(ding), new Set(dong)));

/**
 * Return the union between left & right
 * @example getUnion([1, 2, 3], [1, 4, 5]) -> [1, 2, 3, 4, 5]
 */
export const getUnion = <T = any>(ding: Array<T>, dong: Array<T>) =>
    Array.from(getSetUnion(new Set(ding), new Set(dong)));

/**
 * Return the intersection between left & right
 * @example getUnion([1, 2, 3], [1, 4, 5]) -> [1]
 */
export const getIntersection = <T = any>(ding: Array<T>, dong: Array<T>) =>
    Array.from(getSetIntersection(new Set(ding), new Set(dong)));

/**
 * Checks that all items (right) are in left array
 * @example hasAll([1, 2, 3], [1, 4, 5]) = false
 * @example hasAll([1, 2, 3, 4, 5], [1, 4, 5]) = true
 */
export const hasAll = <T = any>(inArray: Array<T>, items: Array<T>) => isSuperset(new Set(inArray), new Set(items));

/** Return uniques/de-duplicated values in array */
export const uniques = <T = any>(ding: Array<T>) => Array.from(new Set(ding));

/** Return uniques/de-duplicated values in array of objects using the given propPath as unique identifier */
export const uniquesByProp = <T = any>(arr: T[], propPath: string): T[] =>
    arr.reduce(
        (acc, item) => (acc.find((current) => get(current, propPath) === get(item, propPath)) ? acc : acc.concat(item)),
        []
    );

/** Exclude items in array */
export const exclude = <T = any>(arr: T[], excluded: T[]) => arr.filter((item) => !excluded.includes(item));

/** Find an item/index from its value using a property path in the array (can be nested using a dot delimited syntax) */
export const findBy = <T = any, V = any>(arr: T[], path: string, value: V, index?: boolean) =>
    arr[index ? "findIndex" : "find"]((item) => get(item, path) === value);

export type SortDirection = "asc" | "desc";
/** Sort an array of objects by a common key in given direction (asc|desc, defaults to asc) */
export function sortBy<T extends ObjectLiteral, K extends keyof T & string>(
    arr: T[],
    key: K,
    dir: SortDirection = "asc"
) {
    let aProp;
    let bProp;
    const clone = [...arr];
    clone.sort(function (ding, dong) {
        aProp = get(ding, key) || "";
        aProp = aProp.toLowerCase ? aProp.toLowerCase() : aProp;
        bProp = get(dong, key) || "";
        bProp = bProp.toLowerCase ? bProp.toLowerCase() : bProp;

        if (typeof aProp === "string" && typeof bProp === "string") {
            return dir === "asc" ? aProp.localeCompare(bProp) : bProp.localeCompare(aProp);
        }

        if (aProp === bProp) {
            return 0;
        } else if (aProp < bProp) {
            return dir === "asc" ? -1 : 1;
        } else if (aProp > bProp) {
            return dir === "asc" ? 1 : -1;
        }
    });

    return clone;
}

/** Compare arrays & return true if all members are included (order doesn't matter) */
export function isEqualArrays(arr1: PrimitiveValue[], arr2: PrimitiveValue[]) {
    if (arr1.length !== arr2.length) return false;

    let i;
    for (i = arr1.length; i--; ) {
        if (!arr2.includes(arr1[i])) return false;
    }
    return true;
}

/** Combine one or more array into the first one while pushing only distinct unique values */
export const combineUniqueValues = <T extends PrimitiveValue>(arr1: T[] = [], ...arr2: T[][]) =>
    arr2.reduce((acc, nextArr) => Array.from(new Set(acc.concat(nextArr))), arr1);

/** Combine one or more array of objects into the first one while pushing only distinct unique objects using the given propPath as unique identifier */
export const combineUniqueValuesByProps = <T extends ObjectLiteral = any>(arrays: Array<T[]>, propPath: string) =>
    arrays.reduce((acc, nextArr) => uniquesByProp(acc.concat(nextArr), propPath), []);

/** Get first item of array */
export const first = <T>(value: T[]) => value[0];
/** Get last item of array */
export const last = <T>(value: T[]) => value[value.length - 1];

/** Polyfill Array.flatMap */
export function flatMap<T, U>(array: T[], callbackfn: (value: T, index: number, array: T[]) => U[]): U[] {
    return Array.prototype.concat(...array.map(callbackfn));
}

/** Make an array of {count} empty elements */
export const makeArrayOf = (count: number) => Array(count).fill(0);

/** Split an array in chunk of given size */
export const chunk = <T = any>(arr: T[], size: number): Array<T[]> =>
    arr.reduce((chunks, el, i) => (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks, []);

/** Array of picked property */
export const pluck = <K extends keyof T, T extends object>(arr: T[], prop: K) => arr.map((item) => item[prop]);
