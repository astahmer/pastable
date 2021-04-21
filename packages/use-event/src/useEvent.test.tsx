import { findByText, fireEvent, getByText, render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React, { useRef, useState } from "react";
import { test } from "uvu";
import assert from "uvu/assert";

import { setupJSDOM } from "@pastable/test-utils";

import { useEvent } from "./useEvent";

test("useEvent allows defining an event on window in a declarative way", async () => {
    const cleanup = setupJSDOM();

    const TestUseEvent = () => {
        const [key, setKey] = useState("none");

        useEvent("keydown", (event: KeyboardEvent) => setKey(event.key));

        return (
            <>
                <div>key: {key}</div>
            </>
        );
    };

    const result = render(<TestUseEvent />);
    await findByText(result.container, "key: none");
    fireEvent.keyDown(window, { key: "A" });
    await findByText(result.container, "key: A");

    cleanup();
});

test("useEvent callback is only added once on an element", async () => {
    const cleanup = setupJSDOM();

    let renders = 0;
    let callCount = 0;
    const TestUseEvent = () => {
        const [key, setKey] = useState("none");

        useEvent("keydown", (event: KeyboardEvent) => {
            setKey(event.key);
            callCount++;
        });
        renders++;

        return (
            <>
                <div>key: {key}</div>
            </>
        );
    };

    assert.equal(renders, 0);
    assert.equal(callCount, 0);

    const result = render(<TestUseEvent />);
    assert.equal(renders, 1);

    fireEvent.keyDown(window, { key: "A" });
    assert.equal(callCount, 1);
    assert.equal(renders, 2);

    result.rerender(<TestUseEvent />);
    assert.equal(renders, 3);
    assert.equal(callCount, 1);

    fireEvent.keyDown(window, { key: "B" });
    assert.equal(renders, 4);
    assert.equal(callCount, 2);

    cleanup();
});

test("useEvent can be used on a custom element", async () => {
    const cleanup = setupJSDOM();

    const TestUseEvent = () => {
        const buttonRef = useRef();
        const [count, setCount] = useState(0);

        useEvent("click", () => setCount((current) => current + 1), buttonRef.current);

        return (
            <>
                <button ref={buttonRef}>count: {count}</button>
                <button>increment</button>
            </>
        );
    };

    const result = render(<TestUseEvent />);
    await findByText(result.container, "count: 0");
    fireEvent.click(result.getByText("increment"));
    await findByText(result.container, "count: 1");

    cleanup();
});

// let count = 0;
// const callback = () => count++;
// const element = <span>ding</span>;
// const { result } = renderHook(() => useEvent("click", callback, element));
// console.log(result.current);

// assert.equal(result.current.current, true);
// unmount();
// assert.equal(result.current.current, false);
// cleanup();

// test("useEvent", () => {
//     let isMountedStates: boolean[] = [];
//     const { result } = renderHook(() => {
//         const isMounted = useEvent();
//         isMountedStates.push(isMounted);
//         return isMounted;
//     });

//     assert.equal(isMountedStates, [false, true]);
//     assert.equal(result.current, true);
// });

test.run();
