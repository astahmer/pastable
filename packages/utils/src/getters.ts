import { ObjectLiteral } from "@pastable/typings";

export const getSelf = <T = any>(state: T) => state;
export const makeSelfGetters = (keys: string[]) => Object.fromEntries(keys.map((key) => [key, getSelf]));

/** Get 1st/only key of object */
export const firstKey = <T extends ObjectLiteral>(obj: T) => Object.keys(obj)[0] as keyof T;

/** Get 1st/only prop of object */
export const firstProp = <T extends ObjectLiteral>(obj: T) => obj[firstKey(obj)];

/** Make getter on obj[key] */
export const prop = <T extends ObjectLiteral, K extends keyof T>(key: K) => (item: T) => item[key];
