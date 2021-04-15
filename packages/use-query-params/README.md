# use-query-params

Hooks to handle query params state with react-router.
Please check the tests folder if you need more detailed examples.

## Dependencies

-   react / react-router-dom

## Install

```sh
yarn add @pastable/use-query-params
```

or

```sh
npm i @pastable/use-query-params
```

## Usage

### useQueryParams

Allows you to get/set page history with query params, usable like a useState.
Is used by [`useQueryParamsState`](#useQueryParamsState).

```ts
const [queryParams, setQueryParams] = useQueryParams();
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
}
```

#### Formater

```ts
type Formater<Value = any, Return = any, Key extends any = string> = (value: Value, key: Key) => Return;
```

So basically, you get the raw value as first argument and must return the formated value however you want.
The key is passed as second argument since you're less likely to need it to format the value.

### useQueryParamsState

Control a queryParam from its key like a useState. First prop is the query param key, second (optional) key is [`UseQueryParamsProps`](#UseQueryParamsProps).

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
