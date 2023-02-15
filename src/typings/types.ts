import tb from "ts-toolbelt";
import { Length } from "ts-toolbelt/out/List/Length";
import { Split } from "type-fest";

export type PrimitiveValue = string | number | boolean;
export type Primitive = PrimitiveValue | Array<PrimitiveValue>;

export type ObjectLiteral<T = any> = Record<string, T>;
export type JSONValue = PrimitiveValue | JSONObject | JSONArray;
export interface JSONObject {
    [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

// From official doc
export type Unpacked<T> = T extends (infer U)[]
    ? U
    : T extends (...args: any[]) => infer U
    ? U
    : T extends Promise<infer U>
    ? U
    : T;

export type CType<T = any> = new (...args: any[]) => T;
export type AnyFunction<Return = any, Args = any> = (...args: Args[]) => Return;
export type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never;
export type ArrayUnion<T extends Readonly<string[]>> = T[number];

/**
 * Same as Partial<T> but goes deeper and makes Partial<T> all its properties and sub-properties.
 `*/
type DP<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>;
};

export declare type DeepPartial<T> = { [P in keyof T]?: T[P] | DP<T> };

export type NonUndefined<A> = A extends undefined ? never : A;
export type NonFunctionKeys<T extends object> = {
    [K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K;
}[keyof T];

export type StringOrNumber = string | number;

export type AwaitFn<T extends tb.Function.Function<any, P>, P = unknown> = tb.Function.Return<T> extends Promise<
    infer R
>
    ? R
    : T;

export type LiteralUnion<T extends U, U = string> = T | (U & {});

export type PickKnownKeysOptional<First, Second> = Pick<First, Extract<keyof First, keyof Second>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type HasNestedPath<Path extends string> = Length<Split<Path, ".">> extends 1 ? false : true;

export type ToString<T extends string | number | symbol> = T extends string ? T : `${Extract<T, number>}`;
export type ToStringArray<T extends any[]> = T extends [infer F, ...infer R]
    ? F extends string | number | symbol
        ? [ToString<F>, ...ToStringArray<R>]
        : never
    : [];

export type MergeBy<T extends unknown[], Key extends keyof T[number]> = T extends [infer F, ...infer R]
    ? F[Key] extends string | number | symbol
        ? { [K in F[Key]]: F } & MergeBy<R, Key>
        : never
    : {};

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type DeepRequired<T> = {
    [K in keyof T]-?: NonNullable<DeepRequired<T[K]>>;
};

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type IsDefined<T> = [T] extends [never] ? false : true;
export type PickDefined<T> = Pick<T, { [K in keyof T]: T[K] extends never ? never : K }[keyof T]>;
