# @pastable/typings

A bunch of utility types.

## List

### PrimitiveValue

Quickly target a primitive value.

```ts
type PrimitiveValue = string | number | boolean;
```

### Primitive

Either `PrimitiveValue` or an array of `PrimitiveValue`

```ts
type Primitive = PrimitiveValue | Array<PrimitiveValue>;
```

### ObjectLiteral

Pre-configured record for most common uses.

```ts
type ObjectLiteral<T = any> = Record<string, T>;
```

### JSONValue

Possible JSON value.
[https://github.com/Microsoft/TypeScript/issues/3496](source)

```ts
type JSONValue = PrimitiveValue | JSONObject | JSONArray;
```

### JSONObject

JSON object.

```ts
interface JSONObject {
    [x: string]: JSONValue;
}
```

### JSONArray

JSON array.

```ts
interface JSONArray {
    [x: string]: JSONValue;
}
```

### Unpacked

Extract a generic type from where its used.
[https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html](source)

```ts
type Unpacked<T> = T extends (infer U)[]
    ? U
    : T extends (...args: any[]) => infer U
    ? U
    : T extends Promise<infer U>
    ? U
    : T;
```

### CType

Get the constructor of a class.

```ts
type CType<T = any> = new (...args: any[]) => T;
```

### AnyFunction

Literraly allow for any function, has return/args generics.

```ts
type AnyFunction<Return = any, Args = any> = (...args: Args[]) => Return;
```

### FunctionArguments

Get arguments as array from a function type.

```ts
type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never;

// ex
type Ding = (aaaa: string, bbb: number) => void;
type Dong = FunctionArguments<Ding>;
```

### ArrayUnion

Get a union type from a const array.

```ts
type ArrayUnion<T extends Readonly<string[]>> = T[number];

// ex
const keys = ["aaa", "bbb", "ccc"] as const;
type Keys = ArrayUnion<typeof keys>;
// type Keys = "aaa" | "bbb" | "ccc"
```

### DeepPartial

Same as Partial<T> but goes deeper and makes Partial<T> all its properties and sub-properties.
[https://github.com/typeorm/typeorm/blob/master/src/common/DeepPartial.ts](source)

```ts
type DP<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : T[P] extends ReadonlyArray<infer U>
        ? ReadonlyArray<DeepPartial<U>>
        : DeepPartial<T[P]>;
type DeepPartial<T> = { [P in keyof T]?: T[P] | DP<T> }
```

### NonUndefined

Ensure that `<T>` is not undefined.

```ts
type NonUndefined<A> = A extends undefined ? never : A;
```

### NonFunctionKeys

Can be used to retrieve class properties.

```ts
type NonFunctionKeys<T extends object> = {
    [K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K;
}[keyof T];

// ex
class Example {
    stringType: string;
    numberType: number;
    booleanType: boolean;
    nullType: null;
    functionType: () => void;
}
type Dang = NonFunctionKeys<Example>;
// type Dang = "stringType" | "numberType" | "booleanType"
```
