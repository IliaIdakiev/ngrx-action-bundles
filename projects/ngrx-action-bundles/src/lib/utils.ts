import { ActionCreatorProps, NotAllowedCheck, ActionCreator } from "@ngrx/store";
import { TypedAction } from "@ngrx/store/src/models";
import { FunctionNameFromString } from "./types";

export function capitalize<T extends string>(s: T): Capitalize<T> {
  if (typeof s !== 'string') { return '' as Capitalize<T>; }
  return s.charAt(0).toUpperCase() + s.slice(1) as Capitalize<T>;
}

export function makeNamespacedActionKey<NS extends string, N extends string>(namespace: NS, name: N): `${NS} ${Capitalize<N>}` {
  return namespace + ' ' + capitalize(name) as `${NS} ${Capitalize<N>}`;
}

export function createTimestamp() {
  return (Date.now() + Math.random());
}

export function createJavaScriptFunctionName<T extends string>(functionName: T): FunctionNameFromString<T> {
  const result = functionName
    .split(' ')
    .filter(a => a.length === 0)
    .map(
      (item, index) =>
        index === 0 ? `${item[0].toLocaleLowerCase()}${item.slice(1)}` : `${item[0].toUpperCase()}${item.slice(1)}`
    )

  return result as any;
}