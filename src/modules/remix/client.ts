import { TypedResponse } from "@remix-run/node";
import {
  useLoaderData as useRemixLoaderData,
  useActionData as useRemixActionData,
} from "@remix-run/react";
export { usePromiseSubmit } from "./client/usePromiseSubmit"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AnyFunction = (...args: any) => any;

type ExcludeNever<T> = T extends TypedResponse<never> ? never : T;

export type RemixReturnType<T, P extends keyof T> = T[P] extends AnyFunction
  ? Awaited<ReturnType<T[P]>> extends TypedResponse
    ? ExcludeNever<Awaited<ReturnType<Awaited<ReturnType<T[P]>>["json"]>>>
    : ExcludeNever<Awaited<ReturnType<T[P]>>>
  : never;

export type LoaderReturnType<
  T extends { loader?: AnyFunction } & object,
  P extends keyof T = "loader",
> = RemixReturnType<T, P>;

export type ActionReturnType<
  T extends { action?: AnyFunction } & object,
  P extends keyof T = "action",
> = RemixReturnType<T, P>;

export const useLoaderData = <
  T extends { loader?: AnyFunction } & object,
  P extends keyof T = "loader",
>(
  ...args: any
): LoaderReturnType<T, P> => useRemixLoaderData.apply(null, args) as LoaderReturnType<T, P>

export const useActionData = <
  T extends { action?: AnyFunction } & object,
  P extends keyof T = "action",
>(
  ...args: any
): ActionReturnType<T, P> => useRemixActionData.apply(null, args) as ActionReturnType<T, P>;
