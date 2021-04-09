export type ObjectLiteral<V = any> = Record<string, V>;
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
export type FunctionArguments<T extends Function> = T extends (
  ...args: infer R
) => any
  ? R
  : never;
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
