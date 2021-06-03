# @pastable/react

Detect and invoke a callback when clicking away of target element.

## Usage

```ts
const ref = useRef(null);
useClickAway(ref, () => {
    console.log("clicked outside of target");
});
```
