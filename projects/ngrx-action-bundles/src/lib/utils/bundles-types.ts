
import { ObjectWithTimestamp } from "../types";
import { createUniqueAction } from "./create-unique-action";
import { makeActionKeyWithSuffix, makeNamespacedActionKey } from "./key-creators";


export type MakeActionKeyWithSuffixType<Name extends string, Suffix extends string> =
  ReturnType<typeof makeActionKeyWithSuffix<Name, Suffix>>;
export type MakeNamespacedActionKey<Name extends string, Namespace extends string, Suffix extends string = ''> =
  ReturnType<typeof makeNamespacedActionKey<Namespace, MakeActionKeyWithSuffixType<Name, Suffix>>>;

type CreateUniqueActionType<ActionTypeType extends string, Action> = ReturnType<typeof createUniqueAction<ActionTypeType, Action>>;


type ActionBundleItemType<Name extends string, Namespace extends string, Suffix extends string, Action> =
  Record<MakeActionKeyWithSuffixType<Name, Suffix>, CreateUniqueActionType<MakeNamespacedActionKey<Name, Namespace, Suffix>, Action>>;

export type BundleType<Name extends string, Namespace extends string, Action = void> =
  ActionBundleItemType<Name, Namespace, '', Action>;

export type BundleWithTimestampType<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void
> =
  ActionBundleItemType<Name, Namespace, '', Action>;

export type BundleWithClearType<Name extends string, Namespace extends string, Action = void, ActionClear = void> =
  ActionBundleItemType<`set${Capitalize<Name>}`, Namespace, '', Action> &
  ActionBundleItemType<`clear${Capitalize<Name>}`, Namespace, '', ActionClear>;

export type BundleWithTimestampAndClearType<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionClear = void
> =
  BundleWithTimestampType<Name, Namespace, Action> &
  ActionBundleItemType<Name, Namespace, 'Clear', ActionClear>;

export type AsyncBundleType<Name extends string, Namespace extends string, Action, ActionSuccess, ActionFailure, ActionCancel> =
  ActionBundleItemType<Name, Namespace, '', Action> &
  ActionBundleItemType<Name, Namespace, 'Success', ActionSuccess> &
  ActionBundleItemType<Name, Namespace, 'Failure', ActionFailure> &
  ActionBundleItemType<Name, Namespace, 'Cancel', ActionCancel>;

export type AsyncBundleWithClearType<Name extends string, Namespace extends string, Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear> =
  AsyncBundleType<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel> &
  ActionBundleItemType<Name, Namespace, 'Clear', ActionClear>;





export type ActionWithOptionalTimestamp<Action> = Action extends { timestamp: infer U } ? U extends number ? (Omit<Action, 'timestamp'> & { timestamp?: U }) | void : Omit<Action, 'timestamp'> & { timestamp: U } : Action extends void ? (void | { timestamp?: number }) : Action & { timestamp?: number }
export type ActionWithRequiredTimestamp<Action extends { timestamp: any }> = Action;

export type AsyncBundleWithTimestamp<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void
> = AsyncBundleType<
  Name,
  Namespace,
  ActionWithOptionalTimestamp<Action>,
  ActionWithRequiredTimestamp<Action extends { timestamp: infer U } ? Omit<ActionSuccess, 'timestamp'> & { timestamp: U } : ActionSuccess & { timestamp: number }>,
  ActionWithRequiredTimestamp<Action extends { timestamp: infer U } ? Omit<ActionFailure, 'timestamp'> & { timestamp: U } : ActionFailure & { timestamp: number }>,
  ActionWithRequiredTimestamp<Action extends { timestamp: infer U } ? Omit<ActionCancel, 'timestamp'> & { timestamp: U } : ActionCancel & { timestamp: number }>
>

export type AsyncBundleWithTimestampAndClear<
  Name extends string,
  Namespace extends string,
  Action extends Partial<ObjectWithTimestamp<any>> | void = void,
  ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
  ActionClear = void
> = AsyncBundleWithTimestamp<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel> &
  ActionBundleItemType<Name, Namespace, 'Clear', ActionClear>
