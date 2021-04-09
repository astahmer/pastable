import { Dispatch, ReactNode, SetStateAction } from "react";
import { AnyFunction } from "./common";

export interface WithChildren {
    children: ReactNode;
}
export type SetState<T = any> = Dispatch<SetStateAction<T>>;

export type OnSubmit<Values = any, Return = void> = (values: Values) => Return;
export interface WithOnSubmit<Values = any, Return = void> {
    onSubmit: OnSubmit<Values, Return>;
}
export interface WithOnClick<Return = any, Args = any> {
    onClick: AnyFunction<Return, Args>;
}
