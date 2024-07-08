import { useEffect, useRef, useState, useCallback } from "react";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { deferred } from "./helper";
import { serialize } from "object-to-formdata";
import {ActionReturnType, AnyFunction} from "../client";

type Options = {
  delay?: number;
};

export function usePromiseSubmit<
  T extends { action?: AnyFunction } & object,
  K extends keyof T = "action",
  P = ActionReturnType<T, K>,
>(
  options?: Options
): [
  (...args: Parameters<ReturnType<typeof useSubmit>>) => Promise<P>,
  boolean,
] {
  const { delay = 0 } = options ?? {};
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<P>();
  const $deferred = useRef(deferred<P>());
  const nextCanActiveTs = useRef<number>();
  const [loading, setLoading] = useState(false);
  const _submit = useCallback(
    (...args: Parameters<typeof submit>): Promise<P> => {
      if (nextCanActiveTs.current && Date.now() < nextCanActiveTs.current) {
        return Promise.reject();
      }
      setLoading(true);
      nextCanActiveTs.current = Date.now() + delay;
      if (!(args[0] instanceof FormData)) {
        args[0] = serialize(args[0]);
      }
      submit.apply(null, args);
      return $deferred.current.promise;
    },
    [submit]
  );
  useEffect(() => {
    if (navigation.state === "idle" && actionData) {
      function resolve() {
        $deferred.current.resolve(actionData as P);
        $deferred.current = deferred();
        setLoading(false);
      }
      if (nextCanActiveTs.current && Date.now() < nextCanActiveTs.current) {
        setTimeout(resolve, nextCanActiveTs.current - Date.now());
      } else {
        resolve();
      }
    }
  }, [navigation.state, actionData]);
  return [_submit, loading];
}
