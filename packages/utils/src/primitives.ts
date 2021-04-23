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
export const camelToSnake = (str: string) =>
    str.replace(/[\w]([A-Z])/g, (group) => group[0] + "_" + group[1]).toLowerCase();

export const camelToKebab = (str: string) =>
    str.replace(/[\w]([A-Z])/g, (group) => group[0] + "-" + group[1]).toLowerCase();

export const uncapitalize = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/** Limit a number between a [min,max] */
export const limit = (nb: number, [min, max]: [number, number]) => Math.min(Math.max(nb, min), max);
