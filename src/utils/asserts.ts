import { CType, ObjectLiteral, PrimitiveValue } from "../typings";

export const isDefined = <T = any>(
    value: T
): value is typeof value extends undefined ? never : typeof value extends null ? never : T =>
    value !== undefined && value !== null && (typeof value === "string" ? value.trim() !== "" : true);

type Nullable<T> = T | null | undefined;

export const isNotNullish = <T>(element: Nullable<T>): element is T => element != null;

/** Returns true if value is a string|number|boolean */
export const isPrimitive = (value: any): value is PrimitiveValue =>
    !["object", "function", "symbol"].includes(typeof value) || value === null;

/** Returns true if typeof value is object && not null */
export const isObject = (value: any): value is object => value !== null && typeof value === "object";
/** Returns true if value extends basic Object prototype and is not a Date */
export const isObjectLiteral = <T>(value: any): value is T extends unknown ? ObjectLiteral : T =>
    isObject(value) && value.constructor.name === "Object";
export const isDate = (value: any): value is Date => isType<Date>(value, value instanceof Date);
export const isPromise = <T = any>(p: any): p is Promise<T> =>
    p !== null && typeof p === "object" && typeof p.then === "function";

/** Can be used as type guard  */
export const isType = <T>(_value: any, condition?: boolean): _value is T => condition;

export const isClassRegex = /^\s*class\s+/;
export const isClass = <T>(value: any): value is CType<T> =>
    typeof value === "function" && isClassRegex.test(value?.toString?.());

export const isServer = () => typeof window === "undefined";
export const isBrowser = () => !isServer();
