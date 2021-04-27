import { act, renderHook } from "@testing-library/react-hooks";
import { test } from "uvu";
import assert from "uvu/assert";

import { setupJSDOM } from "@pastable/test-utils";

import { useSelection } from "./useSelection";

interface Item {
    id: number;
    label: string;
    value: string;
}
const getId = (item: Item) => item.id;

test("should have a default empty array as initial value", () => {
    setupJSDOM();
    const { result } = renderHook(() => useSelection({ getId }));
    const [current] = result.current;
    assert.equal(current, []);
});

const initial = [
    { id: 1, label: "aaa", value: "A" },
    { id: 2, label: "bbb", value: "B" },
    { id: 3, label: "ccc", value: "C" },
];
test("can use a provided initial value", () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current] = result.current;
    assert.equal(current, current);
});

test("can set the selection state", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.set([]);
    });

    assert.equal(result.current[0], []);

    act(() => {
        actions.set(initial.slice(2));
    });

    assert.equal(result.current[0], initial.slice(2));
});

const yItem = { id: 888, label: "yyy", value: "Y" };
const zItem = { id: 999, label: "zzz", value: "Z" };

test("can add an item to selection", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.add(yItem);
    });

    assert.equal(result.current[0], initial.concat(yItem));
});

test("can add multiple items to selection", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.add([yItem, zItem]);
    });

    assert.equal(result.current[0], initial.concat(yItem, zItem));
});

test("can remove item from selection by index", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.remove(1);
    });

    assert.equal(
        result.current[0],
        initial.filter((item) => item.id !== initial[1].id)
    );
});

test("can remove item from selection by passing the item to remove", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.remove(initial[2]);
    });

    assert.equal(
        result.current[0],
        initial.filter((item) => item.id !== initial[2].id)
    );
});

test("clear", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.clear();
    });

    assert.equal(result.current[0], []);
});

test("can find an item in selection", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    assert.equal(actions.find(initial[2]), initial[2]);
});

test("can find an item in selection by id", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    assert.equal(actions.findById(initial[2].id), initial[2]);
});

test("can find an item & return its index", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    assert.equal(actions.find(initial[2], true), 2);
    assert.equal(actions.findById(initial[2].id, true), 2);
});

test("can check that selection has item", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    assert.equal(actions.has(initial[2]), true);
    assert.equal(actions.has({ id: 111 } as any), false);
});

test("can update an item", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    act(() => {
        actions.update({ ...initial[2], value: "updated" });
    });

    assert.equal(result.current[0][2], { ...initial[2], value: "updated" });
});

const upserted = { id: 777, label: "xxx", value: "upserted" };
test("can upsert an item", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));

    act(() => {
        result.current[1].upsert({ ...initial[2], value: "updated" });
    });

    assert.equal(result.current[0], [
        { id: 1, label: "aaa", value: "A" },
        { id: 2, label: "bbb", value: "B" },
        { id: 3, label: "ccc", value: "updated" },
    ]);

    act(() => {
        result.current[1].upsert(upserted);
    });

    assert.equal(result.current[0], [
        { id: 1, label: "aaa", value: "A" },
        { id: 2, label: "bbb", value: "B" },
        { id: 3, label: "ccc", value: "updated" },
        { id: 777, label: "xxx", value: "upserted" },
    ]);
});

test("can toggle an item", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));

    act(() => {
        const hasItem = result.current[1].toggle(initial[2]);
        assert.equal(hasItem, true);
    });

    assert.equal(
        result.current[0],
        initial.filter((item) => item.id !== initial[2].id)
    );

    act(() => {
        const hasItem = result.current[1].toggle(initial[2]);
        assert.equal(hasItem, false);
    });

    assert.equal(result.current[0], initial);
});

test("can sort by from action", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));

    act(() => {
        result.current[1].sortBy((a, b) => a.label.localeCompare(b.label));
    });

    assert.equal(result.current[0], initial);

    act(() => {
        result.current[1].sortBy((a, b) => b.label.localeCompare(a.label));
    });

    assert.equal(result.current[0], [
        { id: 3, label: "ccc", value: "C" },
        { id: 2, label: "bbb", value: "B" },
        { id: 1, label: "aaa", value: "A" },
    ]);
});

const sortFn = (a: Item, b: Item) => b.label.localeCompare(a.label);
test("can sort by from given compare fn", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial, sortFn }));

    assert.equal(result.current[0], [
        { id: 3, label: "ccc", value: "C" },
        { id: 2, label: "bbb", value: "B" },
        { id: 1, label: "aaa", value: "A" },
    ]);
});

test("can sort by prop", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial, sortBy: "label" }));

    assert.equal(result.current[0], initial);
});

test("can sort by prop in DESC direction", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial, sortBy: "label", sortDirection: "desc" }));

    assert.equal(result.current[0], [
        { id: 3, label: "ccc", value: "C" },
        { id: 2, label: "bbb", value: "B" },
        { id: 1, label: "aaa", value: "A" },
    ]);
});

test("can get current selection from action", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));
    const [current, actions] = result.current;

    assert.equal(current, actions.get());
});

test("reset", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial }));

    act(() => {
        result.current[1].add(upserted);
    });

    assert.equal(result.current[0], initial.concat(upserted));

    act(() => {
        result.current[1].reset();
    });

    assert.equal(result.current[0], initial);
});

test("trying to add an item to selection if max range is exceeded should ignore it", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial, max: 3 }));

    act(() => {
        result.current[1].add(yItem);
    });

    assert.equal(result.current[0], initial);
});

test("trying to add multiple items to selection if max is exceeded will result in only items not yet reaching max being added", async () => {
    const { result } = renderHook(() => useSelection({ getId, initial, max: 4 }));

    act(() => {
        result.current[1].add([yItem, zItem]);
    });

    assert.equal(result.current[0], initial.concat(yItem));
});

test("can update selection when initial changes", async () => {
    const clone = [...initial];
    const { result } = renderHook(() => useSelection({ getId, initial: clone, updateFromInitial: true }));

    act(() => {
        clone.push(yItem);
    });

    assert.equal(result.current[0], initial.concat(yItem));

    act(() => {
        clone.push(zItem);
    });

    assert.equal(result.current[0], initial.concat(yItem, zItem));
});

test("can update selection when initial changes", async () => {
    const clone = [...initial];
    const { result } = renderHook(() => useSelection({ getId, initial: clone, updateFromInitial: true }));

    act(() => {
        clone.push(yItem);
    });

    assert.equal(result.current[0], initial.concat(yItem));

    act(() => {
        clone.push(zItem);
    });

    assert.equal(result.current[0], initial.concat(yItem, zItem));
});

test.run();
