import { AnyFunction, ObjectLiteral } from "../typings";

/** Returns a callback that will call all functions passed with the same arguments */
export const callAll =
    <Args = any, Fns extends Function = AnyFunction<Args>>(...fns: Fns[]) =>
    (...args: Args[]) =>
        fns.forEach((fn) => fn?.(...args));

/** Returns a callback that will return true if all functions passed with the same arguments returns true */
export const needsAll =
    <Args = any, Fns extends Function = AnyFunction<Args>>(...fns: Fns[]) =>
    (...args: Args[]) => {
        for (const fn of fns) {
            if (!fn?.(...args)) {
                return false;
            }
        }
        return true;
    };

export type Composable<T = any, R = any> = (item: T) => R;

/** Compose left-to-right, most commonly used direction */
export const pipe =
    <T>(...fns: Array<(arg: T) => T>) =>
    (value: T) =>
        fns.reduce((acc, fn) => fn(acc), value);

/** Compose right-to-left */
export const compose =
    <T>(...fns: Array<(arg: T) => T>) =>
    (value: T) =>
        fns.reduceRight((acc, fn) => fn(acc), value);

/** Compose right-to-left using async fn */
export const composeAsync =
    <T = any, R = any>(...functions: Composable<T, R>[]) =>
    (item: T) =>
        functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(item));

/** Compose left-to-right, most commonly used direction, using async fn */
export const pipeAsync =
    <T = any, R = any>(...functions: Composable<T, R>[]) =>
    (item: T) =>
        functions.reduce((chain, func) => chain.then(func), Promise.resolve(item));

/** Wait for X ms till resolving promise (with optional callback) */
export const wait = <T extends (...args: any[]) => any>(
    duration: number,
    callback?: T
): Promise<T extends void ? void : T extends (...args: any[]) => infer U ? U : never> =>
    new Promise((resolve) => setTimeout(() => resolve(callback?.()), duration));

/**
 * Gets given's entity all inherited classes.
 * Gives in order from parents to children.
 * For example Post extends ContentModel which extends Unit it will give
 * [Unit, ContentModel, Post]
 *
 * Taken from typeorm/src/metadata-builder/MetadataUtils.ts
 * @see https://github.com/typeorm/typeorm/
 */
export function getInheritanceTree(entity: Function): Function[] {
    const tree: Function[] = [entity];
    const getPrototypeOf = (object: Function): void => {
        const proto = Object.getPrototypeOf(object);
        if (proto?.name) {
            tree.push(proto);
            getPrototypeOf(proto);
        }
    };
    getPrototypeOf(entity);
    return tree;
}

// Shorthand
export const on = <K extends keyof HTMLElementEventMap | keyof WindowEventMap>(
    obj: HTMLElement | Document | Window,
    type: K,
    listener: AnyFunction,
    options?: boolean | AddEventListenerOptions
) => {
    obj.addEventListener(type, listener as any, options);

    return () => off(obj, type, listener, options);
};
export const off = <K extends keyof HTMLElementEventMap | keyof WindowEventMap>(
    obj: HTMLElement | Document | Window,
    type: K,
    listener: AnyFunction,
    options?: boolean | EventListenerOptions
) => obj.removeEventListener(type, listener as any, options);

export const getQueryParams = () => new URLSearchParams(window.location.search);
export const getQueryString = (data: Record<string, any>) => new URLSearchParams(data).toString();

export const makeCompiledFnWith = (code: string, context: ObjectLiteral) =>
    new Function(...Object.keys(context), code)(...Object.values(context));

/** @see Adapted from https://github.com/devld/go-drive/blob/6a126a6daa92af871ae5233306a808c81c749e70/web/src/utils/index.ts */
export const debounce = <Fn extends AnyFunction, THIS>(func: Fn, wait: number): ((...args: Parameters<Fn>) => void) => {
    let timeout: number | undefined;
    return function (this: THIS, ...params) {
        const later = () => {
            timeout = undefined;
            func.apply(this, params);
        };
        clearTimeout(timeout!);
        timeout = setTimeout(later, wait) as unknown as number;
    };
};
export interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

/** @see Adapted from https://github.com/devld/go-drive/blob/6a126a6daa92af871ae5233306a808c81c749e70/web/src/utils/index.ts */
export function throttle<Fn extends AnyFunction, THIS>(
    func: Fn,
    wait: number,
    options?: ThrottleOptions
): (...args: Parameters<Fn>) => ReturnType<Fn> {
    let context: THIS | null, args: Parameters<Fn> | null, result: ReturnType<Fn> | null;
    let timeout: number | undefined;
    let previous = 0;
    if (!options) options = {};
    const later = function () {
        previous = options?.leading === false ? 0 : Date.now();
        timeout = undefined;
        result = func.apply(context, args as Parameters<Fn>);
        if (!timeout) {
            context = null;
            args = null;
        }
    };
    return function (this: THIS, ...params): ReturnType<Fn> {
        const now = Date.now();
        if (!previous && options?.leading === false) previous = now;
        const remaining = wait - (now - previous);
        args = params;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options?.trailing !== false) {
            timeout = setTimeout(later, remaining) as unknown as number;
        }
        return result as any;
    };
}
