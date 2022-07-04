const truthyRegex = /^(true|1)$/i;
const falsyRegex = /^(false|0)$/i;

/** Parse 'true' and 1 as true, 'false' and 0 as false */
export function parseStringAsBoolean(str: string) {
    if (truthyRegex.test(str)) {
        return true;
    } else if (falsyRegex.test(str)) {
        return false;
    }

    return null;
}

export const snakeToCamel = (str: string) => str.replace(/(_\w)/g, (group) => group[1].toUpperCase());
export const kebabToCamel = (str: string) => str.replace(/(-\w)/g, (group) => group[1].toUpperCase());
export const camelToSnake = (str: string) =>
    str.replace(/[\w]([A-Z])/g, (group) => group[0] + "_" + group[1]).toLowerCase();

export const camelToKebab = (str: string) =>
    str.replace(/[\w]([A-Z])/g, (group) => group[0] + "-" + group[1]).toLowerCase();

export const uncapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/** Limit a number between a [min,max] */
export const limit = (nb: number, [min, max]: [number, number]) => Math.min(Math.max(nb, min), max);
export const limitStr = (str: string, limit: number, fallback = "--") =>
    str?.length >= limit ? fallback : str || fallback;

export const areRectsIntersecting = (a: DOMRect, b: DOMRect) =>
    !(a.y + a.height < b.y || a.y > b.y + b.height || a.x + a.width < b.x || a.x > b.x + b.width);

export const getSum = (arr: number[]) => arr.reduce((acc, item) => acc + item, 0);
export const getClosestNbIn = (arr: number[], to: number) =>
    arr.reduce((prev, curr) => (Math.abs(curr - to) < Math.abs(prev - to) ? curr : prev));

export const forceInt = (value: string | number, defaultValue: number = 1) =>
    (value = isNaN(value as number) ? defaultValue : parseInt(value as string));
export const getPageCount = (itemsCount: number, pageSize: number) => Math.ceil(itemsCount / pageSize);
export const roundTo = (nb: number, pow = 2) => Math.round(nb * Math.pow(10, pow)) / Math.pow(10, pow);

export const stringify = <Data = any>(data: Data, spacing = 2, returnError = false) => {
    try {
        return JSON.stringify(data, null, spacing);
    } catch (error) {
        return returnError ? error : null;
    }
};
export const safeJSONParse = <Data = any>(data: string, returnError = false): Data => {
    try {
        return JSON.parse(data);
    } catch (error) {
        return returnError ? error : null;
    }
};

export const getTotalPages = (totalElements: number, pageSize: number) =>
    totalElements ? Math.ceil(totalElements / pageSize) : 0;

export function slugify(text: string) {
    return text
        .toString() // Cast to string (optional)
        .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
        .toLowerCase() // Convert the string to lowercase letters
        .trim() // Remove whitespace from both sides of a string (optional)
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}
