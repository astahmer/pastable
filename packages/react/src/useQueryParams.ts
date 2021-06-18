import { SetStateAction, useEffect } from "react";

import { ObjectLiteral } from "@pastable/typings";
import { Formater, format, isBrowser, isDefined, isType } from "@pastable/utils";

import { useEvent } from "./useEvent";
import { useForceUpdate } from "./useForceUpdate";

/** Get/set page history with query params  */
export const useQueryParams = <QP = ObjectLiteral>(props: UseQueryParamsProps<QP> = {}) => {
    const { getterFormater, setterFormater, toPath } = props;

    const state = useCurrentQueryParams<QP>(getterFormater as any);
    const setter = useSetQueryParams<QP>({ formater: setterFormater as any, toPath });
    const reset = (keys?: Array<keyof QP>) =>
        setter(Object.fromEntries((keys || Object.keys(state)).map((key: any) => [key, undefined])));

    // Set default values for keys not yet in query params
    useEffect(() => {
        if (!props.defaultValues) return;

        setter({ ...props.defaultValues, ...state });
    }, []);

    return [state, setter, reset] as [Partial<QP>, UseQueryParamsSetState<Partial<QP>>, () => void];
};

export interface UseQueryParamsProps<QP = ObjectLiteral> extends Pick<UseSetQueryParamsProps, "toPath"> {
    /** Getter used to parse query params as object from query string */
    getterFormater?: Formater<QP[keyof QP], any, keyof QP>;
    /** Setter used to serialize query string from query param object */
    setterFormater?: Formater<QP[keyof QP], any, keyof QP>;
    /** Set default values for keys not yet in query params */
    defaultValues?: QP;
}

export const getLocation = () => (isBrowser() ? window.location : ({ search: {} } as Location));

/** Get parsed query params, might be formated using given method */
export const useCurrentQueryParams = <QP = ObjectLiteral, F extends Formater = Formater>(formater?: F) => {
    const location = getLocation();
    const params = new URLSearchParams(location.search);
    const parsed = decodeValues(Object.fromEntries(params.entries()));

    const forceUpdate = useForceUpdate();
    useEvent("pushstate" as any, forceUpdate);

    const formated = formater ? format(parsed, formater) : parsed;
    return formated as QP;
};

/** Control a queryParam from its key like a useState  */
export const useQueryParamsState = <Value, Key extends string = any, QP = any>(
    key: Key,
    props: UseQueryParamsStateProps<Value, Key, QP> = {}
) => {
    const { getterFormater, setterFormater, toPath, defaultValue } = props;

    const state = useCurrentQueryParams<QP>(getterFormater as any);
    const setter = useSetQueryParams({ formater: setterFormater as any, toPath });

    const queryParam = state[(key as any) as keyof QP] || defaultValue;
    const setQueryParam = (action: SetStateAction<Value>) => {
        const current = isType<Function>(action, typeof action === "function") ? action(queryParam as any) : action;
        setter({ [key]: current });
    };

    return [queryParam as Value, setQueryParam] as undefined extends QP
        ? [Value, UseQueryParamsSetState<Value>]
        : [QP[Key extends keyof QP ? Key : never], UseQueryParamsSetState<QP[Key extends keyof QP ? Key : never]>];
    //  as UseQueryParamsState<QP[keyof QP]>
};
export interface UseQueryParamsStateProps<Value, K, QP = ObjectLiteral> extends Pick<UseSetQueryParamsProps, "toPath"> {
    /** Getter used to parse query params as object from query string */
    getterFormater?: Formater<QP[K extends keyof QP ? K : never], any, K>;
    /** Setter used to serialize query string from query param object */
    setterFormater?: Formater<QP[K extends keyof QP ? K : never], any, K>;
    /** Set default values for keys not yet in query params */
    defaultValue?: Value | QP[K extends keyof QP ? K : never];
}

export type UseQueryParamsSetState<T = any> = (action: SetStateAction<T>) => void;
export type UseQueryParamsState<T = any> = [T, UseQueryParamsSetState<T>];

const noop = () => {};
export const getHistory = () =>
    isBrowser() ? window.history : (({ pushState: noop, replaceState: noop } as any) as History);

export type HistoryMode = "push" | "replace";
/** Update page history by merging current queryParams with values */
export const useSetQueryParams = <QP = ObjectLiteral>({
    toPath: toPathProp,
    formater,
}: UseSetQueryParamsProps = {}) => {
    const merger = useQueryParamsMerger<typeof formater, QP>(formater);
    const setter = (values: Partial<QP>, mode: HistoryMode = "push", toPath?: UseSetQueryParamsProps["toPath"]) => {
        const history = getHistory();
        const location = getLocation();

        const pathname = location.pathname;
        const basePath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

        const path = toPath || toPathProp;
        // Either pass a static toPath or a function that will be given basePath as argument
        const to = path ? (typeof path === "string" ? path : path(basePath)) : basePath;
        const url = to + merger(values);

        if (mode === "push") {
            history.pushState(values, "", url);
        } else {
            history.replaceState(values, "", url);
        }
    };

    return setter;
};

export type UseSetQueryParamsToPathFn = (currentPathname: string) => string;
export interface UseSetQueryParamsProps {
    /**
     * Allow overriding the pathname on which the history will be pushed/replaced,
     * defaults to current history.location.pathname
     * Either pass a static toPath or a function that will be given basePath as argument
     */
    toPath?: string | UseSetQueryParamsToPathFn;
    /** Custom formater fn to be passed to useQueryParamsMerger */
    formater?: Formater;
}

/** Merge current queryParams with values and return the resulting query string */
export const useQueryParamsMerger = <F extends Function = Formater, QP = ObjectLiteral>(customFormater?: F) => {
    const params = useCurrentQueryParams();

    return (values: Partial<QP>) => formatObjToQueryString({ ...params, ...values }, customFormater);
};

const decodeValues = <T = ObjectLiteral>(obj: T) => format(obj, decodeURIComponent);

/** Remove object keys if not valid as query params */
export const formatObjToQueryString = <Value = ObjectLiteral, F extends Function = Formater>(
    obj: Value,
    customFormater?: F
) =>
    "?" +
    Object.entries(obj)
        .map(([key, value]) => [key, formatValueToQueryParam(value, customFormater, key)])
        .filter(([key, value]) => isValidQueryParam(value, key))
        .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
        .join("&");

function isValidQueryParam<Value = any>(value: Value, _key: string) {
    if (Array.isArray(value)) return value.length;
    if (typeof value === "object") return value instanceof Date;
    return isDefined(value);
}

function formatValueToQueryParam<Value = any, F extends Function = Formater>(
    rawValue: Value,
    customFormater: F | null,
    key: string
) {
    const value = customFormater?.(rawValue, key) || rawValue;

    return value;
}

// Taken from https://github.com/streamich/react-use/blob/8ceb4c0f0c5625124f487b435a2fd0d3b3bc2a4f/src/useLocation.this
// Props to him
function patchHistoryMethod(method: "pushState" | "replaceState") {
    const history = window.history;
    const original = history[method];

    history[method] = function (state) {
        const result = original.apply(this, arguments);
        const event = new Event(method.toLowerCase());

        (event as any).state = state;

        window.dispatchEvent(event);

        return result;
    };
}

if (isBrowser()) {
    // if (isBrowser() && (import.meta as any).hot.data?.patchState !== "patched") {
    // console.log("patching");
    patchHistoryMethod("pushState");
    patchHistoryMethod("replaceState");
    // (import.meta as any).hot.data.patchState = "patched";
}
