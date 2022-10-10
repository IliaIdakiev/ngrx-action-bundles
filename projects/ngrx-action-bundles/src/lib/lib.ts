import { ofType } from '@ngrx/effects';
import { ObjectWithTimestamp } from './types';
import { BundleType, MakeActionKeyWithSuffixType, MakeNamespacedActionKey, } from './utils';
import {
  createActionObject, createActionWithClearObject, createActionWithTimestampAndClearObject,
  createAsyncActionObject, createAsyncActionWithClearObject,
  createAsyncTimestampActionObject, createAsyncTimestampActionWithClearObject,
  createTimestampActionObject
} from './utils/action-object-creators';
import {
  AsyncCreatorBundleWithTimestampAndClearBundleResult,
  AsyncCreatorBundleWithTimestampBundleResult,
  AsyncDispatchBundleWithTimestampAndClearBundleResult,
  AsyncDispatchBundleWithTimestampBundleResult,
  CreatorBundleWithTimestampAndClearBundleResult,
  CreatorBundleWithTimestampBundleResult,
  DispatchBundleWithTimestampAndClearBundleResult,
  DispatchBundleWithTimestampBundleResult,
  StreamBundleResult,
  StreamBundleWithTimestampResult
} from './utils/bundle-result-types';

function createActionStreamBundle<T extends BundleType<any, any>>(this: any, bundle: T) {
  const bundleEntries = Object.entries(bundle as any);
  const result = {} as any;
  for (const [key, value] of bundleEntries) {
    Object.defineProperty(result, `${key}\$`, {
      get() {
        return this.$internal.actions$.pipe(ofType((value as any).type));
      },
      enumerable: true
    });
  }

  return result as StreamBundleResult<T>;
}

function createActionDispatchBundle<T>(this: any, bundle: T) {
  const result = {} as any;
  const bundleEntries = Object.entries(bundle as any);
  for (const [key, value] of bundleEntries) {
    Object.defineProperty(result, key, {
      get() {
        return (payload: any) => {
          const action = (value as any)(payload);
          this.$internal.dispatch(action);
          return action;
        };
      }
    });
  }

  return result as {
    [K in keyof T]:
    T[K] extends (payload: infer P) => infer R ?
    (payload: P) => R : T[K] extends (...args: infer F) => infer R ? (...args: F) => R :
    T[K] extends () => infer R ? () => R : never;
  };
}


export function createAsyncBundle<
  Name extends string,
  Namespace extends string,
>(name: Name, ns: Namespace) {
  return function creator<
    Action = void,
    ActionSuccess = void,
    ActionFailure = void,
    ActionCancel = void
  >() {
    const bundle = createAsyncActionObject<Name, Namespace>(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel>();
    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  }
}

export function createAsyncTimestampBundle<
  Name extends string,
  Namespace extends string,
>(name: Name, ns: Namespace) {
  return function creator<
    Action extends ObjectWithTimestamp<any> | void = void,
    ActionSuccess extends ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number> = { timestamp: Action extends ObjectWithTimestamp<infer U> ? U : number },
    ActionFailure extends ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number> = { timestamp: Action extends ObjectWithTimestamp<infer U> ? U : number },
    ActionCancel extends ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number> = { timestamp: Action extends ObjectWithTimestamp<infer U> ? U : number },
  >() {
    const bundle = createAsyncTimestampActionObject<Name, Namespace>(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel>();
    const creators = bundle as unknown as AsyncCreatorBundleWithTimestampBundleResult<Name, Namespace, Action extends void ? { timestamp?: number } : Action, ActionSuccess, ActionFailure, ActionCancel>;
    const listen = createActionStreamBundle<typeof bundle>(bundle) as StreamBundleWithTimestampResult<typeof bundle>;
    const dispatch = createActionDispatchBundle<typeof bundle>(bundle) as AsyncDispatchBundleWithTimestampBundleResult<
      Name,
      Namespace,
      Action,
      ActionSuccess,
      ActionFailure,
      ActionCancel
    >;

    return { listen, dispatch, creators };
  }
}

export function createAsyncBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<
    Action = void,
    ActionSuccess = void,
    ActionFailure = void,
    ActionCancel = void,
    ActionClear = void
  >() {
    const bundle = createAsyncActionWithClearObject<
      Name,
      Namespace
    >(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear>();
    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  }
}

export function createAsyncTimestampBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<
    Action extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionSuccess extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionFailure extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionCancel extends (Partial<ObjectWithTimestamp<Action extends ObjectWithTimestamp<infer U> ? U : number>>) | void = void,
    ActionClear = void
  >() {
    const bundle = createAsyncTimestampActionWithClearObject<
      Name,
      Namespace
    >(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear>();

    const creators = bundle as unknown as AsyncCreatorBundleWithTimestampAndClearBundleResult<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear>;
    const listen = createActionStreamBundle<typeof bundle>(bundle) as StreamBundleWithTimestampResult<typeof bundle>;
    const dispatch = createActionDispatchBundle(bundle) as AsyncDispatchBundleWithTimestampAndClearBundleResult<
      Name,
      Namespace,
      Action,
      ActionSuccess,
      ActionFailure,
      ActionCancel,
      ActionClear
    >;

    return { listen, dispatch, creators };
  }
}

export function createBundle<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {

  return function creator<Action = void>() {
    const bundle = createActionObject<Name, Namespace>(name, namespace)<Action>();

    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  };
}

export function createTimestampBundle<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action extends Partial<ObjectWithTimestamp<any>> | void = void>() {
    const bundle = createTimestampActionObject<Name, Namespace>(name, namespace)<Action>();
    const creators = bundle as unknown as CreatorBundleWithTimestampBundleResult<
      MakeActionKeyWithSuffixType<Name, ''>,
      MakeNamespacedActionKey<Name, Namespace>,
      Action
    >;
    const listen = createActionStreamBundle(bundle) as StreamBundleWithTimestampResult<typeof bundle>;
    const dispatch = createActionDispatchBundle(bundle) as DispatchBundleWithTimestampBundleResult<
      MakeActionKeyWithSuffixType<Name, ''>,
      MakeNamespacedActionKey<Name, Namespace>,
      Action
    >;

    return { listen, dispatch, creators };
  };
}

export function createBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action = void, ActionClear = void>() {
    const bundle = createActionWithClearObject<Name, Namespace>(name, namespace)<Action, ActionClear>();

    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  };
}

export function createTimestampBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action extends Partial<ObjectWithTimestamp> = { timestamp: number }, ActionClear = void>() {
    const bundle = createActionWithTimestampAndClearObject<Name, Namespace>(name, namespace)<Action, ActionClear>();
    const creators = bundle as CreatorBundleWithTimestampAndClearBundleResult<
      `set${Capitalize<MakeActionKeyWithSuffixType<Name, ''>>}`,
      MakeNamespacedActionKey<Name, Namespace>,
      `clear${Capitalize<MakeActionKeyWithSuffixType<Name, ''>>}`,
      MakeNamespacedActionKey<Name, Namespace, 'Clear'>,
      Action,
      ActionClear
    >;

    const listen = createActionStreamBundle(bundle) as StreamBundleWithTimestampResult<typeof bundle>;
    const dispatch = createActionDispatchBundle(bundle) as DispatchBundleWithTimestampAndClearBundleResult<
      MakeActionKeyWithSuffixType<Name, ''>,
      MakeNamespacedActionKey<Name, Namespace>,
      MakeActionKeyWithSuffixType<Name, 'Clear'>,
      MakeNamespacedActionKey<Name, Namespace, 'Clear'>,
      Action,
      ActionClear
    >;

    return { listen, dispatch, creators };
  };
}
