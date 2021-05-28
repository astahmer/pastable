import { exclude, makeArrayOf } from "./array";

export const getRandomString = (length = 10) =>
    [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join("");

export function getRandomIntIn(minOrMax: number, maxOptional?: number) {
    const min = maxOptional === undefined ? 0 : minOrMax;
    const max = maxOptional === undefined ? minOrMax : maxOptional;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Randomly pick N unique element in array while excluding some if needed
 * @see https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
 */
export function pickMultipleUnique<T = any>(arr: T[], n: number, excluded: T[] = []) {
    if (n >= arr.length) n = arr.length;

    const pickable = exclude(arr, excluded);
    const result: T[] = [];
    let picked: T;
    while (n--) {
        picked = pickOne(exclude(pickable, result));
        result.push(picked);
    }
    return result;
}

/** Returns a random element in given array */
export const pickOne = <T = any>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
/** Returns a random element in given array but not of the excluded */
export const pickOneBut = <T = any>(arr: T[], excluded: T | T[]) => {
    const excludedArr = Array.isArray(excluded) ? excluded : [excluded];
    let current;
    do {
        current = pickOne(arr);
    } while (excludedArr.includes(current));
    return current;
};

/** Like pickOne but for typescript enums */
export function pickOneInEnum<T>(anEnum: T, excluded?: T[keyof T][]): T[keyof T] {
    return pickOneBut(Object.values(anEnum), excluded);
}

/** Make an array of [min, max] empty elements */
export const makeArrayOfRandIn = (x: number = 5, y?: number) => makeArrayOf(getRandomIntIn(x, y));
