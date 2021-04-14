import { CType, ObjectLiteral, Primitive } from "@pastable/typings";

import { getEnv } from "./misc";

export const isDefined = (value: any) =>
    value !== undefined && value !== null && (typeof value === "string" ? value.trim() !== "" : true);

export const isPrimitive = (value: any): value is Primitive =>
    !["object", "function", "symbol"].includes(typeof value) || value === null;

export const isObject = (value: any): value is object => value !== null && typeof value === "object";
export const isObjectLiteral = <T>(value: any): value is T extends unknown ? ObjectLiteral : T =>
    isObject(value) && value.constructor.name === "Object";
export const isDate = (value: any): value is Date => isType<Date>(value, value instanceof Date);
export const isPromise = <T = any>(p: any): p is Promise<T> =>
    p !== null && typeof p === "object" && typeof p.then === "function";

export const isType = <T>(_value: any, condition?: boolean): _value is T => condition;

export const isClassRegex = /^\s*class\s+/;
export const isClass = <T>(value: any): value is CType<T> =>
    typeof value === "function" && isClassRegex.test(value?.toString?.());

export const isServer = () => typeof window === "undefined";
export const isBrowser = () => !isServer();
export const isProd = () => getEnv() === "production";
export const isDev = () => !isProd();
