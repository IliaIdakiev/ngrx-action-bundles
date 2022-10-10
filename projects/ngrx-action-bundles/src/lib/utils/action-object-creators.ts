import { ObjectWithTimestamp } from "../types";
import {
  ActionWithOptionalTimestamp, AsyncBundleType, AsyncBundleWithClearType,
  AsyncBundleWithTimestamp, AsyncBundleWithTimestampAndClear, BundleType, BundleWithClearType,
  BundleWithTimestampAndClearType, BundleWithTimestampType
} from "./bundles-types";
import { capitalize } from "./capitalize";
import { createUniqueAction, createUniqueRequiredTimestampAction, createUniqueTimestampAction } from "./create-unique-action";
import { makeActionKeyWithSuffix, makeNamespacedActionKey } from "./key-creators";

// Create a single ngrx action object that will be used inside connect
export function createActionObject<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action = void>(): BundleType<Name, Namespace, Action> {
    const actionKey = makeActionKeyWithSuffix(name, '');

    const actionType = makeNamespacedActionKey(namespace, actionKey);

    const actionCreator = createUniqueAction(actionType);

    const result = {
      [actionKey]: actionCreator
    };

    return result as BundleType<Name, Namespace, Action>;
  }
}

// Create a single ngrx action that has a timestamp that will be used inside connect
export function createTimestampActionObject<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<
    Action extends Partial<ObjectWithTimestamp<any>> | void = void
  >(): BundleWithTimestampType<
    Name, Namespace,
    ActionWithOptionalTimestamp<Action>
  > {
    const actionKey = makeActionKeyWithSuffix(name, '');

    const actionType = makeNamespacedActionKey(namespace, actionKey);
    type ActionTypeType = typeof actionType;

    const actionCreator = createUniqueTimestampAction<ActionTypeType, Action>(actionType);

    const result = {
      [actionKey]: actionCreator
    };

    return result as any;
  }
}

// Create a two ngrx actions (set/clear) that will be used inside connect
export function createActionWithClearObject<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action, ActionClear>(): BundleWithClearType<Name, Namespace, Action, ActionClear> {
    const actionKey = makeActionKeyWithSuffix('set', capitalize(name));
    const actionClearKey = makeActionKeyWithSuffix('clear', capitalize(name));

    const actionType = makeNamespacedActionKey(namespace, actionKey);
    const actionTypeClear = makeNamespacedActionKey(namespace, actionClearKey);

    type ActionTypeType = typeof actionType;
    type ActionCancelTypeType = typeof actionTypeClear;

    const actionCreator = createUniqueAction<ActionTypeType, Action>(actionType);
    const actionClearCreator = createUniqueAction<ActionCancelTypeType, ActionClear>(actionTypeClear);

    const result = {
      [actionKey]: actionCreator,
      [actionClearKey]: actionClearCreator
    };

    return result as BundleWithClearType<Name, Namespace, Action, ActionClear>;
  }
}

// Create a two ngrx actions (set/clear) that have a timestamp and will be used inside connect
export function createActionWithTimestampAndClearObject<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<
    Action extends Partial<ObjectWithTimestamp<any>> | void = void,
    ActionClear = void
  >(): BundleWithTimestampAndClearType<Name, Namespace, ActionWithOptionalTimestamp<Action>, ActionClear> {
    const actionKey = makeActionKeyWithSuffix('set', capitalize(name));
    const actionClearKey = makeActionKeyWithSuffix('clear', capitalize(name));

    const actionType = makeNamespacedActionKey(namespace, actionKey);
    const actionTypeClear = makeNamespacedActionKey(namespace, actionClearKey);

    type ActionTypeType = typeof actionType;
    type ActionCancelTypeType = typeof actionTypeClear;

    const actionCreator = createUniqueTimestampAction<ActionTypeType, Action>(actionType);
    const actionClearCreator = createUniqueAction<ActionCancelTypeType, ActionClear>(actionTypeClear);

    const result = {
      [actionKey]: actionCreator,
      [actionClearKey]: actionClearCreator
    };

    return result as any;
  }
}

// Create ngrx actions (dispatch/success/failure/cancel) that will be used inside connect
export function createAsyncActionObject<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<
    Action = void,
    ActionSuccess = void,
    ActionFailure = void,
    ActionCancel = void
  >(): AsyncBundleType<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel> {
    const actionKey = makeActionKeyWithSuffix(name, '');
    const actionSuccessKey = makeActionKeyWithSuffix(name, 'Success');
    const actionFailureKey = makeActionKeyWithSuffix(name, 'Failure');
    const actionCancelKey = makeActionKeyWithSuffix(name, 'Cancel');

    const actionType = makeNamespacedActionKey(ns, actionKey);
    const actionTypeSuccess = makeNamespacedActionKey(ns, actionSuccessKey);
    const actionTypeFailure = makeNamespacedActionKey(ns, actionFailureKey);
    const actionTypeCancel = makeNamespacedActionKey(ns, actionCancelKey);

    type ActionTypeType = typeof actionType;
    type ActionSuccessTypeType = typeof actionTypeSuccess;
    type ActionFailureTypeType = typeof actionTypeFailure;
    type ActionCancelTypeType = typeof actionTypeCancel;

    const actionCreator = createUniqueAction<ActionTypeType, Action>(actionType);
    const actionSuccessCreator = createUniqueAction<ActionSuccessTypeType, ActionSuccess>(actionTypeSuccess);
    const actionFailureCreator = createUniqueAction<ActionFailureTypeType, ActionFailure>(actionTypeFailure);
    const actionCancelCreator = createUniqueAction<ActionCancelTypeType, ActionCancel>(actionTypeCancel);

    const result = {
      [actionKey]: actionCreator,
      [actionSuccessKey]: actionSuccessCreator,
      [actionFailureKey]: actionFailureCreator,
      [actionCancelKey]: actionCancelCreator
    };

    return result as any;
  }
}

// Create ngrx actions (dispatch/success/failure/cancel) that have a timestamp and will be used inside connect
export function createAsyncTimestampActionObject<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<
    Action extends Partial<ObjectWithTimestamp<any>> | void = void,
    ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void
  >(): AsyncBundleWithTimestamp<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel> {

    const actionKey = makeActionKeyWithSuffix(name, '');
    const actionSuccessKey = makeActionKeyWithSuffix(name, 'Success');
    const actionFailureKey = makeActionKeyWithSuffix(name, 'Failure');
    const actionCancelKey = makeActionKeyWithSuffix(name, 'Cancel');

    const actionType = makeNamespacedActionKey(ns, actionKey);
    const actionTypeSuccess = makeNamespacedActionKey(ns, actionSuccessKey);
    const actionTypeFailure = makeNamespacedActionKey(ns, actionFailureKey);
    const actionTypeCancel = makeNamespacedActionKey(ns, actionCancelKey);

    const actionCreator = createUniqueTimestampAction(actionType);
    const actionSuccessCreator = createUniqueRequiredTimestampAction(actionTypeSuccess);
    const actionFailureCreator = createUniqueRequiredTimestampAction(actionTypeFailure);
    const actionCancelCreator = createUniqueRequiredTimestampAction(actionTypeCancel);

    const result = {
      [actionKey]: actionCreator,
      [actionSuccessKey]: actionSuccessCreator,
      [actionFailureKey]: actionFailureCreator,
      [actionCancelKey]: actionCancelCreator
    };

    return result as any;
  };
}

// Create a two ngrx actions (dispatch/success/failure/cancel/clear) that will be used inside connect
export function createAsyncActionWithClearObject<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<
    Action = void,
    ActionSuccess = void,
    ActionFailure = void,
    ActionCancel = void,
    ActionClear = void
  >(): AsyncBundleWithClearType<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear> {
    const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');

    const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

    type ActionClearTypeType = typeof actionTypeClear;

    const actionCreatorClear = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

    const result = {
      ...createAsyncActionObject(name, ns),
      [actionClearKey]: actionCreatorClear
    };

    return result as any;
  }
}

// Create ngrx actions (dispatch/success/failure/cancel) that have a timestamp and will be used inside connect
export function createAsyncTimestampActionWithClearObject<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<
    Action extends Partial<ObjectWithTimestamp<any>> | void = void,
    ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionClear = void
  >(): AsyncBundleWithTimestampAndClear<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear> {

    const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');

    const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

    type ActionClearTypeType = typeof actionTypeClear;

    const actionCreatorClear = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

    const result = {
      ...createAsyncTimestampActionObject(name, ns),
      [actionClearKey]: actionCreatorClear
    };

    return result as any;
  };
}

