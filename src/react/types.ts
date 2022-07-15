import { Dispatch, MutableRefObject, ReactNode, SetStateAction } from "react";
import { AnyFunction } from "../typings";

export interface WithChildren {
    children: ReactNode;
}

export interface WithRef {
    ref?: MutableRefObject<any>;
}
export interface WithClassName {
    className?: string;
}

export type SetState<T = any> = Dispatch<SetStateAction<T>>;
export type UseStateProps<Name extends string, T> = { [key in Name]: T } & {
    [key in `set${Capitalize<Name>}`]: SetState<T>;
};

export type OnSubmit<Values = any, Return = void> = (values: Values) => Return;
export interface WithOnSubmit<Values = any, Return = void> {
    onSubmit: OnSubmit<Values, Return>;
}
export interface WithOnClick<Return = any, Args = any> {
    onClick: AnyFunction<Return, Args>;
}
