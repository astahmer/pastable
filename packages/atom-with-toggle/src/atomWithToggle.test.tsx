import { fireEvent, render } from "@testing-library/react";
import { Provider as ProviderOrig, useAtom } from "jotai";
import React, { Fragment } from "react";
import { test } from "uvu";
import assert from "uvu/assert";

import { setupJSDOM } from "@pastable/test-utils";

import { atomWithToggle, atomWithToggleStored } from "./atomWithToggle";

const Provider = process.env.PROVIDER_LESS_MODE ? Fragment : ProviderOrig;

test("simple toggle", async () => {
    const cleanup = setupJSDOM();
    const activeAtom = atomWithToggle(true);

    const Toggle: React.FC = () => {
        const [isActive, toggle] = useAtom(activeAtom);
        return (
            <>
                <div>isActive: {isActive + ""}</div>
                <button onClick={() => toggle()}>toggle</button>
                <button onClick={() => toggle(true)}>force true</button>
                <button onClick={() => toggle(false)}>force false</button>
            </>
        );
    };

    const { findByText, getByText } = render(
        <Provider>
            <Toggle />
        </Provider>
    );

    await findByText("isActive: true");

    fireEvent.click(getByText("toggle"));
    await findByText("isActive: false");

    fireEvent.click(getByText("toggle"));
    await findByText("isActive: true");

    fireEvent.click(getByText("force true"));
    await findByText("isActive: true");

    fireEvent.click(getByText("force false"));
    await findByText("isActive: false");

    fireEvent.click(getByText("force true"));
    await findByText("isActive: true");

    cleanup();
});

const storageData: Record<string, boolean> = {
    isActive: false,
};
const dummyStorage = {
    getItem: (key: string) => {
        if (!(key in storageData)) {
            throw new Error("no value stored");
        }
        return storageData[key];
    },
    setItem: (key: string, newValue: boolean) => {
        storageData[key] = newValue;
    },
};

test("simple toggle with storage", async () => {
    const cleanup = setupJSDOM();
    const activeAtom = atomWithToggleStored("isActive", false, dummyStorage);

    const Toggle: React.FC = () => {
        const [isActive, toggle] = useAtom(activeAtom);
        return (
            <>
                <div>isActive: {isActive + ""}</div>
                <button onClick={() => toggle()}>toggle</button>
            </>
        );
    };

    const { findByText, getByText } = render(
        <Provider>
            <Toggle />
        </Provider>
    );

    await findByText("isActive: false");

    fireEvent.click(getByText("toggle"));
    await findByText("isActive: true");
    assert.equal(storageData.isActive, true);

    fireEvent.click(getByText("toggle"));
    await findByText("isActive: false");
    assert.equal(storageData.isActive, false);

    cleanup();
});

test.run();
