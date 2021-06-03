import { findByText, fireEvent, render } from "@testing-library/react";
import React, { useState } from "react";
import { test } from "uvu";

import { setupJSDOM } from "@pastable/test-utils";

import { useUpdateEffect } from "../src/useUpdateEffect";

test("useUpdateEffect allows defining an event on window in a declarative way", async () => {
    const cleanup = setupJSDOM();

    let effects = 0;
    const TestUseUpdateEffect = () => {
        const [count, setCount] = useState(0);

        useUpdateEffect(() => {
            effects++;
        }, [count]);

        return (
            <>
                <div>effects: {effects}</div>
                <div>count: {count}</div>
                <button onClick={() => setCount(count + 1)}>increment</button>
            </>
        );
    };

    const result = render(<TestUseUpdateEffect />);
    await findByText(result.container, "effects: 0");
    fireEvent.click(result.getByText("increment"));
    await findByText(result.container, "effects: 1");

    cleanup();
});

test.run();
