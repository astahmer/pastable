import { AnyFunction, ObjectLiteral } from "../typings";

/** Returns a callback that will call all functions passed with the same arguments */
export const callAll =
    <Args = any, Fns extends Function = AnyFunction<Args>>(...fns: Fns[]) =>
    (...args: Args[]) =>
        fns.forEach((fn) => fn?.(...args));

export type Composable<T = any, R = any> = (item: T) => R;

/** Compose right-to-left */
export const compose =
    <T = any, R = any>(...functions: Composable<T, R>[]) =>
    (item: T) =>
        functions.reduceRight((chain, func) => chain.then(func), Promise.resolve(item));

/** Compose left-to-right, most commonly used */
export const pipe =
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
