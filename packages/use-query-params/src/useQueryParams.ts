import { SetStateAction } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { ObjectLiteral } from "@pastable/typings";
import { Formater, format, getSelf, isDefined, isType } from "@pastable/utils";

/** Get/set page history with query params  */
export const useQueryParams = <QP = ObjectLiteral>(props: UseQueryParamsProps<QP> = {}) => {
    const { getterFormater, setterFormater, toPath } = props;

    const state = useCurrentQueryParams<QP>(getterFormater as any);
    const setter = useSetQueryParams({ formater: setterFormater as any, toPath });

    return [state, setter];
};

export interface UseQueryParamsProps<QP = ObjectLiteral> extends Pick<UseSetQueryParamsProps, "toPath"> {
    /** Getter used to parse query params as object from query string */
    getterFormater?: Formater<QP[keyof QP], any, keyof QP>;
    /** Setter used to serialize query string from query param object */
    setterFormater?: Formater<QP[keyof QP], any, keyof QP>;
}

/** Get parsed query params, might be formated using given method */
export const useCurrentQueryParams = <QP = ObjectLiteral, F extends Formater = Formater>(formater?: F) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const parsed = decodeValues(Object.fromEntries(params.entries()));

    const formated = formater ? format(parsed, formater) : parsed;
    return formated as QP;
};

/** Control a queryParam from its key like a useState  */
export const useQueryParamsState = <QP = ObjectLiteral>(key: keyof QP, props: UseQueryParamsProps<QP> = {}) => {
    const { getterFormater, setterFormater, toPath } = props;

    const state = useCurrentQueryParams<QP>(getterFormater as any);
    const setter = useSetQueryParams({ formater: setterFormater as any, toPath });

    const queryParam = state[key];
    const setQueryParam = <T = any>(action: SetStateAction<T>) => {
        const current = isType<Function>(action, typeof action === "function")
            ? action((state as unknown) as T)
            : action;
        setter({ [key]: current });
    };

    return [queryParam, setQueryParam] as UseQueryParamsState<QP[keyof QP]>;
};
export interface UseQueryParamsStateProps<K extends keyof QP, QP = ObjectLiteral> extends UseQueryParamsProps<QP> {
    getterFormater?: Formater<QP[K], any, K>;
    setterFormater?: Formater<QP[K], any, K>;
}

export type UseQueryParamsSetState<T = any> = (action: SetStateAction<T>) => void;
export type UseQueryParamsState<T = any> = [T, UseQueryParamsSetState<T>];

export type HistoryMode = "push" | "replace";
/** Update page history by merging current queryParams with values */
export const useSetQueryParams = ({ toPath = getSelf, formater }: UseSetQueryParamsProps = {}) => {
    const history = useHistory();
    const pathname = history.location.pathname;
    const basePath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    // Either pass a static toPath or a function that will be given basePath as argument
    const to = typeof toPath === "string" ? toPath : toPath(basePath);

    const merger = useQueryParamsMerger(formater);
    const setter = <Values = ObjectLiteral>(values: Values, mode: HistoryMode = "push") =>
        history[mode](to + merger(values));

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
export const useQueryParamsMerger = <F extends Function = Formater>(customFormater?: F) => {
    const params = useCurrentQueryParams();
    const merger = (values: ObjectLiteral) => formatObjToQueryString({ ...params, ...values }, customFormater);

    return merger;
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
