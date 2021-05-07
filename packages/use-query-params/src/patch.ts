import { isBrowser } from "@pastable/utils";

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
