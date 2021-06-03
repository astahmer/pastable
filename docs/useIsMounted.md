# @pastable/use-is-mounted

Keep track of a component mounted using ref/state.

Helps fixing the common problem when trying to update state after an async operation in useEffect for example and React throws this :

> Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

## Usage

### useIsMountedRef

```ts
const isMountedRef = useIsMountedRef();
const [data, setData] = useState(null);

useEffect(() => {
    const fetchAync = async () => {
        try {
            const result = await somethingReturningAPromise();
            if (!isMountedRef.current) return;

            // Here you know the component is still mounted
            setData(result);
        } catch (e) {
            // do something here
        }
    };
}, []);
```

### useIsMounted

Same as `useIsMountedRef` but triggers a render since it uses a state and not a ref.
Could be used to apply a style when component is not yet client-rendered when using SSR (such as with NextJS).

```tsx
const Component = () => {
    const isMounted = useIsMounted();

    return (<div style={{ display: !isMounted ? "none" : "" }}>)
}
```
