import { act, renderHook, suppressErrorOutput } from "@testing-library/react-hooks";
import React from "react";
import { MemoryRouter, Route, RouteComponentProps } from "react-router-dom";
import { test } from "uvu";
import assert from "uvu/assert";

import { WithChildren } from "@pastable/typings";
import { parseStringAsBoolean } from "@pastable/utils";

import {
    formatObjToQueryString,
    useParsedQueryParams,
    useQueryParamsMerger,
    useSetQueryParams,
} from "./useQueryParams";

test("formatObjToQueryString", () => {
    assert.equal(formatObjToQueryString({ abc: "123", xyz: "string" }), "?abc=123&xyz=string");
});

test("useParsedQueryParams returns parsed query params", () => {
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route path="*">{children}</Route>
        </MemoryRouter>
    );

    const { result } = renderHook(() => useParsedQueryParams(), { wrapper });
    assert.equal(result.current, { abc: "123", xyz: "string" });
});

test("useParsedQueryParams format parsed query params using given method", () => {
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123,456&xyz=string&bool=true&otherBool=0"]}>
            <Route path="*">{children}</Route>
        </MemoryRouter>
    );

    const formater = (value: any) => {
        if (value.includes(",")) return value.split(",");
        const bool = parseStringAsBoolean(value);
        return typeof bool === "boolean" ? bool : value;
    };

    const { result } = renderHook(() => useParsedQueryParams(formater), { wrapper });
    assert.equal(result.current, {
        abc: ["123", "456"],
        xyz: "string",
        bool: true,
        otherBool: false,
    });
});

test("useQueryParamsMerger merges current parsed query params with values", () => {
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route path="*">{children}</Route>
        </MemoryRouter>
    );

    const { result } = renderHook(() => useQueryParamsMerger(), { wrapper });
    const merged = result.current({ newParam: "NEW" });
    assert.equal(merged, formatObjToQueryString({ abc: "123", xyz: "string", newParam: "NEW" }));
});

test("useSetQueryParams updates current query params with values", () => {
    const restoreConsole = suppressErrorOutput();

    let testLocation: RouteComponentProps["location"];
    const wrapper = ({ children }: WithChildren) => (
        <MemoryRouter initialEntries={["/test?abc=123&xyz=string"]}>
            <Route
                path="*"
                render={({ location }) => {
                    testLocation = location;
                    return children;
                }}
            />
        </MemoryRouter>
    );

    const { result } = renderHook(() => useSetQueryParams(), { wrapper });

    act(() => {
        result.current({ newParam: "NEW" });
    });

    assert.equal(testLocation.search, "?abc=123&xyz=string&newParam=NEW");
    restoreConsole();
});

test.run();
