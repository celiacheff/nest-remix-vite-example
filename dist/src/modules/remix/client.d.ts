import { TypedResponse } from "@remix-run/node";
export { usePromiseSubmit } from "./client/usePromiseSubmit";
export type AnyFunction = (...args: any) => any;
type ExcludeNever<T> = T extends TypedResponse<never> ? never : T;
export type RemixReturnType<T, P extends keyof T> = T[P] extends AnyFunction ? Awaited<ReturnType<T[P]>> extends TypedResponse ? ExcludeNever<Awaited<ReturnType<Awaited<ReturnType<T[P]>>["json"]>>> : ExcludeNever<Awaited<ReturnType<T[P]>>> : never;
export type LoaderReturnType<T extends {
    loader?: AnyFunction;
} & object, P extends keyof T = "loader"> = RemixReturnType<T, P>;
export type ActionReturnType<T extends {
    action?: AnyFunction;
} & object, P extends keyof T = "action"> = RemixReturnType<T, P>;
export declare const useLoaderData: <T extends {
    loader?: AnyFunction;
} & object, P extends keyof T = "loader">(...args: any) => LoaderReturnType<T, P>;
export declare const useActionData: <T extends {
    action?: AnyFunction;
} & object, P extends keyof T = "action">(...args: any) => ActionReturnType<T, P>;
