import { Observable } from "rxjs"
import { ObjectWithTimestamp } from "../types"
import { MakeActionKeyWithSuffixType, MakeNamespacedActionKey } from "./bundles-types";
import { createUniqueAction, createUniqueTimestampAction } from "./create-unique-action";

/* Stream Results */
export type StreamBundleResult<T> = {
  [K in keyof T & string as `${K}\$`]: Observable<T[K] extends (...args: any) => any ? ReturnType<T[K]> : never>
}

/* Stream Timestamp Results */
export type StreamBundleWithTimestampResult<T> = {
  [K in keyof T & string as `${K}\$`]: Observable<T[K] extends (...args: any) => infer RT ? RT extends void ? { payload: { timestamp: number } } : RT extends { payload: { timestamp: infer U } } ? ReturnType<T[K]> & { payload: { timestamp: U } } : ReturnType<T[K]> & { payload: { timestamp: number } } : never>
}

/* Creator Timestamp Results */
export type AsyncCreatorBundleWithTimestampActionObject<
  ActionKey extends string,
  ActionSuccessKey extends string,
  ActionFailureKey extends string,
  ActionCancelKey extends string,
  ActionType extends string,
  ActionSuccessType extends string,
  ActionFailureType extends string,
  ActionCancelType extends string,
  Action extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
> =
  Record<ActionKey, ReturnType<typeof createUniqueAction<ActionType, Action extends { timestamp: number } ? (Omit<Action, 'timestamp'> & { timestamp?: number }) | void : Action extends { timestamp: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : { timestamp?: number } | void>>> &
  // Record<ActionKey, (payload: Action extends { timestamp: number } ? (Omit<Action, 'timestamp'> & { timestamp?: number }) | void : Action extends { timestamp: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : { timestamp?: number } | void) => ({ payload: Action, type: ActionType })> &
  Record<ActionSuccessKey, ReturnType<typeof createUniqueAction<ActionSuccessType, ActionSuccess>>> &
  // Record<ActionSuccessKey, (payload: ActionSuccess) => ({ payload: ActionSuccess, type: ActionSuccessType })> &
  Record<ActionFailureKey, ReturnType<typeof createUniqueAction<ActionFailureType, ActionFailure>>> &
  // Record<ActionFailureKey, (payload: ActionFailure) => ({ payload: ActionFailure, type: ActionFailureType })> &
  Record<ActionCancelKey, ReturnType<typeof createUniqueAction<ActionCancelType, ActionCancel>>>;
// Record<ActionCancelKey, (payload: ActionCancel) => ({ payload: ActionCancel, type: ActionCancelType })>;


export type AsyncCreatorBundleWithTimestampAndClearActionObject<
  ActionKey extends string,
  ActionSuccessKey extends string,
  ActionFailureKey extends string,
  ActionCancelKey extends string,
  ActionClearKey extends string,
  ActionType extends string,
  ActionSuccessType extends string,
  ActionFailureType extends string,
  ActionCancelType extends string,
  ActionClearType extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | { timestamp: number } = { timestamp: number },
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionClear extends any = void
> = AsyncCreatorBundleWithTimestampActionObject<
  ActionKey,
  ActionSuccessKey,
  ActionFailureKey,
  ActionCancelKey,
  ActionType,
  ActionSuccessType,
  ActionFailureType,
  ActionCancelType,
  Action,
  ActionSuccess,
  ActionFailure,
  ActionCancel
> &
  Record<ActionClearKey, ReturnType<typeof createUniqueAction<ActionClearType, ActionClear>>>;


export type CreatorBundleWithTimestampBundleResult<
  ActionKey extends string,
  ActionType extends string,
  Action extends any,
> = Record<
  ActionKey,
  ReturnType<typeof createUniqueTimestampAction<
    ActionType,
    Action extends Object ? Action extends { timestamp?: number } ? Omit<Action, 'timestamp'> & { timestamp?: number } : Action extends { timestamp?: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : Action & { timestamp?: number } : { timestamp?: number }
  >>
>;

export type CreatorBundleWithTimestampAndClearBundleResult<
  ActionKey extends string,
  ActionType extends string,
  ActionClearKey extends string,
  ActionClearType extends string,
  Action extends any,
  ActionClear = any
> = CreatorBundleWithTimestampBundleResult<ActionKey, ActionType, Action> &
  Record<ActionClearKey, ReturnType<typeof createUniqueAction<ActionClearType, ActionClear>>>;

export type AsyncCreatorBundleWithTimestampBundleResult<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | { timestamp: number } = { timestamp: number },
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: number },
> = AsyncCreatorBundleWithTimestampActionObject<
  MakeActionKeyWithSuffixType<Name, ''>,
  MakeActionKeyWithSuffixType<Name, 'Success'>,
  MakeActionKeyWithSuffixType<Name, 'Failure'>,
  MakeActionKeyWithSuffixType<Name, 'Cancel'>,
  MakeNamespacedActionKey<Name, Namespace, ''>,
  MakeNamespacedActionKey<Name, Namespace, 'Success'>,
  MakeNamespacedActionKey<Name, Namespace, 'Failure'>,
  MakeNamespacedActionKey<Name, Namespace, 'Cancel'>,
  Action extends { timestamp: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : { timestamp: number },
  Action extends { timestamp: infer U } ? ActionSuccess extends void ? { timestamp: U } : Omit<ActionSuccess, 'timestamp'> & { timestamp: U } : ActionSuccess extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  Action extends { timestamp: infer U } ? ActionFailure extends void ? { timestamp: U } : Omit<ActionFailure, 'timestamp'> & { timestamp: U } : ActionFailure extends void ? { timestamp: number } : Omit<ActionFailure, 'timestamp'> & { timestamp: number },
  Action extends { timestamp: infer U } ? ActionCancel extends void ? { timestamp: U } : Omit<ActionCancel, 'timestamp'> & { timestamp: U } : ActionCancel extends void ? { timestamp: number } : Omit<ActionCancel, 'timestamp'> & { timestamp: number }
>

export type AsyncCreatorBundleWithTimestampAndClearBundleResult<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionClear extends any = void,
> = AsyncCreatorBundleWithTimestampAndClearActionObject<
  MakeActionKeyWithSuffixType<Name, ''>,
  MakeActionKeyWithSuffixType<Name, 'Success'>,
  MakeActionKeyWithSuffixType<Name, 'Failure'>,
  MakeActionKeyWithSuffixType<Name, 'Cancel'>,
  MakeActionKeyWithSuffixType<Name, 'Clear'>,
  MakeNamespacedActionKey<Name, Namespace, ''>,
  MakeNamespacedActionKey<Name, Namespace, 'Success'>,
  MakeNamespacedActionKey<Name, Namespace, 'Failure'>,
  MakeNamespacedActionKey<Name, Namespace, 'Cancel'>,
  MakeNamespacedActionKey<Name, Namespace, 'Clear'>,
  Action extends { timestamp: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : { timestamp: number },
  Action extends { timestamp: infer U } ? ActionSuccess extends void ? { timestamp: U } : Omit<ActionSuccess, 'timestamp'> & { timestamp: U } : ActionSuccess extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  Action extends { timestamp: infer U } ? ActionFailure extends void ? { timestamp: U } : Omit<ActionFailure, 'timestamp'> & { timestamp: U } : ActionFailure extends void ? { timestamp: number } : Omit<ActionFailure, 'timestamp'> & { timestamp: number },
  Action extends { timestamp: infer U } ? ActionCancel extends void ? { timestamp: U } : Omit<ActionCancel, 'timestamp'> & { timestamp: U } : ActionCancel extends void ? { timestamp: number } : Omit<ActionCancel, 'timestamp'> & { timestamp: number },
  ActionClear
>

type TimestampDispatchActionHelper<F extends (...args: any[]) => any, T = number> = F extends (...args: infer U) => infer R ? (...args: U) => R & { payload: { timestamp: T } } : never;

/* Dispatch Timestamp Results */
export type AsyncDispatchBundleWithTimestampActionObject<
  ActionKey extends string,
  ActionSuccessKey extends string,
  ActionFailureKey extends string,
  ActionCancelKey extends string,
  ActionType extends string,
  ActionSuccessType extends string,
  ActionFailureType extends string,
  ActionCancelType extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: Action extends { timestamp: infer U } ? U : number },
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: Action extends { timestamp: infer U } ? U : number },
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: Action extends { timestamp: infer U } ? U : number },
> =
  Record<ActionKey, TimestampDispatchActionHelper<ReturnType<typeof createUniqueAction<ActionType, Action extends { timestamp: number } ? (Omit<Action, 'timestamp'> & { timestamp?: number }) | void : Action extends { timestamp: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : { timestamp?: number } | void>>, Action extends { timestamp: infer U } ? U : number>> &
  Record<ActionSuccessKey, ReturnType<typeof createUniqueTimestampAction<ActionSuccessType, ActionSuccess>>> &
  Record<ActionFailureKey, ReturnType<typeof createUniqueTimestampAction<ActionFailureType, ActionFailure>>> &
  Record<ActionCancelKey, ReturnType<typeof createUniqueTimestampAction<ActionCancelType, ActionCancel>>>;


export type AsyncDispatchBundleWithTimestampAndClearActionObject<
  ActionKey extends string,
  ActionSuccessKey extends string,
  ActionFailureKey extends string,
  ActionCancelKey extends string,
  ActionClearKey extends string,
  ActionType extends string,
  ActionSuccessType extends string,
  ActionFailureType extends string,
  ActionCancelType extends string,
  ActionClearType extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: Action extends ObjectWithTimestamp<infer U> ? U : number },
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: Action extends ObjectWithTimestamp<infer U> ? U : number },
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | { timestamp: number } = { timestamp: Action extends ObjectWithTimestamp<infer U> ? U : number },
  ActionClear = void
> = AsyncDispatchBundleWithTimestampActionObject<
  ActionKey,
  ActionSuccessKey,
  ActionFailureKey,
  ActionCancelKey,
  ActionType,
  ActionSuccessType,
  ActionFailureType,
  ActionCancelType,
  Action,
  ActionSuccess,
  ActionFailure,
  ActionCancel
> & Record<ActionClearKey, ReturnType<typeof createUniqueAction<ActionClearType, ActionClear>>>;

export type DispatchBundleWithTimestampBundleResult<
  ActionKey extends string,
  ActionType extends string,
  Action extends void | Partial<ObjectWithTimestamp<any>>
> = Record<ActionKey, (payload: Action extends Object ? Action extends { timestamp?: number } ? Omit<Action, 'timestamp'> & { timestamp?: number } : Action extends { timestamp?: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : Action & { timestamp?: number } : { timestamp?: number }) => ReturnType<ReturnType<typeof createUniqueTimestampAction<ActionType, Action>>>>;

export type DispatchBundleWithTimestampAndClearBundleResult<
  ActionKey extends string,
  ActionType extends string,
  ActionClearKey extends string,
  ActionClearType extends string,
  Action extends void | Partial<ObjectWithTimestamp<any>>,
  ActionClear extends any = void
> = DispatchBundleWithTimestampBundleResult<ActionKey, ActionType, Action> & Record<ActionClearKey, (payload: ActionClear) => ReturnType<ReturnType<typeof createUniqueAction<ActionClearType, ActionClear>>>>;

export type AsyncDispatchBundleWithTimestampBundleResult<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
> = AsyncDispatchBundleWithTimestampActionObject<
  MakeActionKeyWithSuffixType<Name, ''>,
  MakeActionKeyWithSuffixType<Name, 'Success'>,
  MakeActionKeyWithSuffixType<Name, 'Failure'>,
  MakeActionKeyWithSuffixType<Name, 'Cancel'>,
  MakeNamespacedActionKey<Name, Namespace, ''>,
  MakeNamespacedActionKey<Name, Namespace, 'Success'>,
  MakeNamespacedActionKey<Name, Namespace, 'Failure'>,
  MakeNamespacedActionKey<Name, Namespace, 'Cancel'>,
  Action extends { timestamp: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : { timestamp: number },
  Action extends { timestamp: infer U } ? ActionSuccess extends void ? { timestamp: U } : Omit<ActionSuccess, 'timestamp'> & { timestamp: U } : ActionSuccess extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  Action extends { timestamp: infer U } ? ActionFailure extends void ? { timestamp: U } : Omit<ActionFailure, 'timestamp'> & { timestamp: U } : ActionFailure extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  Action extends { timestamp: infer U } ? ActionCancel extends void ? { timestamp: U } : Omit<ActionCancel, 'timestamp'> & { timestamp: U } : ActionCancel extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number }
>

export type AsyncDispatchBundleWithTimestampAndClearBundleResult<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionClear extends any = void,
> = AsyncDispatchBundleWithTimestampAndClearActionObject<
  MakeActionKeyWithSuffixType<Name, ''>,
  MakeActionKeyWithSuffixType<Name, 'Success'>,
  MakeActionKeyWithSuffixType<Name, 'Failure'>,
  MakeActionKeyWithSuffixType<Name, 'Cancel'>,
  MakeActionKeyWithSuffixType<Name, 'Clear'>,
  MakeNamespacedActionKey<Name, Namespace, ''>,
  MakeNamespacedActionKey<Name, Namespace, 'Success'>,
  MakeNamespacedActionKey<Name, Namespace, 'Failure'>,
  MakeNamespacedActionKey<Name, Namespace, 'Cancel'>,
  MakeNamespacedActionKey<Name, Namespace, 'Clear'>,
  Action extends { timestamp?: infer U } ? Omit<Action, 'timestamp'> & { timestamp: U } : Action extends void ? (void | { timestamp?: number }) : Action & { timestamp?: number },
  Action extends { timestamp?: infer U } ? ActionSuccess extends void ? { timestamp: U } : Omit<ActionSuccess, 'timestamp'> & { timestamp: U } : ActionSuccess extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  Action extends { timestamp?: infer U } ? ActionFailure extends void ? { timestamp: U } : Omit<ActionFailure, 'timestamp'> & { timestamp: U } : ActionFailure extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  Action extends { timestamp?: infer U } ? ActionCancel extends void ? { timestamp: U } : Omit<ActionCancel, 'timestamp'> & { timestamp: U } : ActionCancel extends void ? { timestamp: number } : Omit<ActionSuccess, 'timestamp'> & { timestamp: number },
  ActionClear
>
