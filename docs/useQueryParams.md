# @pastable/react

https://user-images.githubusercontent.com/47224540/116145173-44f7b600-a6dd-11eb-8f99-283ee7b628fe.mp4

Hooks to handle query params state with react-router.
Please check the tests folder if you need more detailed examples.

## Install

```sh
yarn add @pastable/react
```

or

```sh
npm i @pastable/use-query-params
```

## Usage

### useQueryParams

Allows you to get/set page history with query params, usable like a useState.
Is used by [`useQueryParamsState`](#useQueryParamsState).

`setQueryParams` merges (using `useQueryParamsMerger`) the current query params with the values you provide it.
So if you want to remove a query param you must set the key with a undefined or null as value.
Ex: `setQueryParams({ ding: "aaa", count: undefined })` will remove the `count` query param and add a `ding` query param but leave the rest (if any) untouched.

```ts
const [queryParams, setQueryParams, resetQueryParams] = useQueryParams();
```

#### UseQueryParamsProps

```ts
interface UseQueryParamsProps<QP = ObjectLiteral> {
    /** Getter used to parse query params as object from query string */
    getterFormater?: Formater<QP[keyof QP], any, keyof QP>;
    /** Setter used to serialize query string from query param object */
    setterFormater?: Formater<QP[keyof QP], any, keyof QP>;
    /**
     * Allow overriding the pathname on which the history will be pushed/replaced,
     * defaults to current history.location.pathname
     * Either pass a static toPath or a function that will be given basePath as argument
     */
    toPath?: string;
    /** Set default values for keys not yet in query params */
    defaultValues?: QP;
}
```

#### Formater

```ts
type Formater<Value = any, Return = any, Key extends any = string> = (value: Value, key: Key) => Return;
```

So basically, you get the raw value as first argument and must return the formated value however you want.
The key is passed as second argument since you're less likely to need it to format the value.

### useQueryParamsState

Control a queryParam from its key like a useState. First prop is the query param key, second (optional) key is almost the same as [`UseQueryParamsProps`](#UseQueryParamsProps) but it trades `defaultValues` for `defaultValue`.

```ts
const [page, setPage] = useQueryParamsState("page");
```

### useCurrentQueryParams

Get parsed query params, might be formated using given method.
Is used by [`useQueryParams`](#useQueryParams).

```ts
const queryParams = useCurrentQueryParams();
```

Only mandatory prop is `getterFormater` from [`UseQueryParamsProps`](#UseQueryParamsProps), can be passed directly like this :
`const queryParams = useCurrentQueryParams(customFormater);`

### useSetQueryParams

Update page history by merging current queryParams with values.
Is used by [`useQueryParams`](#useQueryParams).

```ts
const setQueryParams = useSetQueryParams();
```

Accepts a prop object containing both `toPath` & `formater` (`setterFormatter`) from [`UseQueryParamsProps`](#UseQueryParamsProps).

### useQueryParamsMerger

Merge current queryParams with values and return the resulting query string.
Is used by `useSetQueryParams`(#useSetQueryParams).

```ts
const merger = useQueryParamsMerger();
```

### formatObjToQueryString

Remove object keys if not valid as query params.
Is used by `useQueryParamsMerger`(#useQueryParamsMerger).

```ts
const queryString = formatObjToQueryString(params, customFormater);
```
