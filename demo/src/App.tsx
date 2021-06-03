import "./App.css";

import React, { useEffect, useRef } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import {
    UseQueryParamsSetState,
    getRandomString,
    useForceUpdate,
    useQueryParams,
    useQueryParamsState,
} from "@pastable/core";

const Wrapper = ({ children }: any) => <BrowserRouter>{children}</BrowserRouter>;

function App() {
    return (
        <Wrapper>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul>
                            <li>
                                <Link style={{ color: "white" }} to="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link style={{ color: "white" }} to="/use-query-params">
                                    UseQueryParams
                                </Link>
                            </li>
                            <li>
                                <Link style={{ color: "white" }} to="/use-force-update">
                                    UseForceUpdate
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route path="/use-query-params">
                            <UseQueryParams />
                        </Route>
                        <Route path="/use-force-update">
                            <UseForceUpdate />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </header>
            </div>
        </Wrapper>
    );
}

const UseQueryParams = () => {
    const [queryParams, setQueryParams, reset] = useQueryParams({ defaultValues: { yes: 3, abc: 111, bbb: 222 } });

    const resetCountQueryParam = () => setQueryParams({ count: undefined } as any);
    const setRandomQueryParam = () => setQueryParams({ [getRandomString()]: 1 });

    return (
        <>
            <UseQueryParamsState setQueryParams={setQueryParams as any} />
            <div>{JSON.stringify(queryParams, null, 4)}</div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                    padding: "10px",
                    border: "2px solid white",
                }}
            >
                <button onClick={setRandomQueryParam}>Set random string in query param</button>
                <button onClick={resetCountQueryParam}>Reset count qp</button>
                <button onClick={() => reset()}>Reset all</button>
            </div>
        </>
    );
};

const UseQueryParamsState = ({
    setQueryParams,
}: {
    setQueryParams: UseQueryParamsSetState<Partial<{ count: number }>>;
}) => {
    const [count, setCount] = useQueryParamsState("count", { defaultValue: 4, getterFormater: Number });
    const increment = () => setCount((count) => count + 1);
    const setCountQueryParam = () => setQueryParams({ count: count * 2 });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px",
                padding: "10px",
                border: "2px solid white",
            }}
        >
            <p>count is: {count}</p>
            <button onClick={increment}>increment</button>
            <button onClick={setCountQueryParam}>set count to double its current state</button>
        </div>
    );
};

const UseForceUpdate = () => {
    const countRef = useRef(0);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        countRef.current = countRef.current + 1;
    });

    return (
        <>
            <div>renders: {countRef.current}</div>
            <button onClick={forceUpdate}>force update</button>
        </>
    );
};

const Home = () => <>Home</>;

export default App;
