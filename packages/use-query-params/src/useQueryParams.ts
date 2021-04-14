import { useHistory, useLocation } from "react-router-dom";

import { ObjectLiteral } from "@pastable/typings";
import { Formater, format, getSelf, isDefined } from "@pastable/utils";

/** Get/set page history with query params  */
export const useQueryParams = () => {
    const state = useParsedQueryParams();
    const setter = useSetQueryParams();

    return [state, setter];
};

/** Get parsed query params, might be formated using given method */
export const useParsedQueryParams = <F extends Function = Formater>(formater?: F) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const parsed = decodeValues(Object.fromEntries(params.entries()));

    const formated = formater ? format(parsed, formater) : parsed;
    return formated;
};

export type HistoryMode = "push" | "replace";
/** Update page history by merging current queryParams with values */
export const useSetQueryParams = (toPath = getSelf) => {
    const history = useHistory();
    const pathname = history.location.pathname;
    const basePath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    // Either pass a static toPath or a function that will be given basePath as argument
    const to = typeof toPath === "string" ? toPath : toPath(basePath);

    const merger = useQueryParamsMerger();
    const setter = <Values = ObjectLiteral>(values: Values, mode: HistoryMode = "push") =>
        history[mode](to + merger(values));

    return setter;
};

/** Merge current queryParams with values and return the resulting query string */
export const useQueryParamsMerger = <F extends Function = Formater>(customFormater?: F) => {
    const params = useParsedQueryParams();
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
    _key: string
) {
    const value = customFormater?.(rawValue) || rawValue;

    return value;
}
