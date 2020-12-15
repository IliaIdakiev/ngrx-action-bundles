import { Actions, ofType } from '@ngrx/effects';
import { ActionCreator, TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { WithDispatchAndListenResult } from './types';
import { createUniqueAction, makeActionKeyWithSuffix, makeNamespacedActionKey } from './utils';

// tslint:disable-next-line:typedef
function createAction<Name extends string, Namespace extends string, Action>(name: Name, namespace: Namespace) {
  const actionKey = makeActionKeyWithSuffix(name, '');
  type ActionKeyType = typeof actionKey;

  const actionType = makeNamespacedActionKey(namespace, actionKey);
  type ActionTypeType = typeof actionType;

  const actionCreator = createUniqueAction<ActionTypeType, Action>(actionType);

  type ActionBundle = Record<ActionKeyType, typeof actionCreator>;

  const result = {
    [actionKey]: actionCreator
  };

  return result as ActionBundle;
}

// tslint:disable-next-line:typedef
function createActionWithClear<
  Name extends string,
  Namespace extends string,
  Action,
  ActionCancel
>(name: Name, namespace: Namespace) {
  const actionKey = makeActionKeyWithSuffix(name, '');
  const actionCancelKey = makeActionKeyWithSuffix(name, 'Cancel');

  type ActionKeyType = typeof actionKey;
  type ActionCancelKeyType = typeof actionCancelKey;

  const actionType = makeNamespacedActionKey(namespace, actionKey);
  const actionTypeCancel = makeNamespacedActionKey(namespace, actionCancelKey);

  type ActionTypeType = typeof actionType;
  type ActionCancelTypeType = typeof actionTypeCancel;

  const actionCreator = createUniqueAction<ActionTypeType, Action>(actionType);
  const actionCancelCreator = createUniqueAction<ActionCancelTypeType, ActionCancel>(actionTypeCancel);

  // type ActionMapType = MapKeyToCreator<{ t: typeof actionCreator }, ActionKeyType>;
  // type ActionCancelMapType = MapKeyToCreator<{ t: typeof actionCancelCreator }, ActionCancelKeyType>;

  type ActionBundle = Record<ActionKeyType, typeof actionCreator> & Record<ActionCancelKeyType, typeof actionCancelCreator>;

  const result = {
    [actionKey]: actionCreator,
    [actionCancelKey]: actionCancelCreator
  };

  return result as ActionBundle;
}

// tslint:disable-next-line:typedef
function createAsyncActionBundle<
  Name extends string,
  Namespace extends string,
  Action = void,
  ActionSuccess = void,
  ActionFailure = void,
  ActionCancel = void
>(name: Name, ns: Namespace) {
  const actionKey = makeActionKeyWithSuffix(name, '');
  const actionSuccessKey = makeActionKeyWithSuffix(name, 'Success');
  const actionFailureKey = makeActionKeyWithSuffix(name, 'Failure');
  const actionCancelKey = makeActionKeyWithSuffix(name, 'Cancel');

  type ActionKeyType = typeof actionKey;
  type ActionSuccessKeyType = typeof actionSuccessKey;
  type ActionFailureKeyType = typeof actionFailureKey;
  type ActionCancelKeyType = typeof actionCancelKey;

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

  type ActionBundle =
    Record<ActionKeyType, typeof actionCreator> &
    Record<ActionSuccessKeyType, typeof actionSuccessCreator> &
    Record<ActionFailureKeyType, typeof actionFailureCreator> &
    Record<ActionCancelKeyType, typeof actionCancelCreator>;

  const result = {
    [actionKey]: actionCreator,
    [actionSuccessKey]: actionSuccessCreator,
    [actionFailureKey]: actionFailureCreator,
    [actionCancelKey]: actionCancelCreator
  };

  return result as ActionBundle;
}

// tslint:disable-next-line:typedef
function createAsyncActionBundleWithClear<
  Name extends string,
  Namespace extends string,
  Action = void,
  ActionSuccess = void,
  ActionFailure = void,
  ActionCancel = void,
  ActionClear = void
>(name: Name, ns: Namespace) {
  const bundle = createAsyncActionBundle<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel>(name, ns);
  const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');
  const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

  type ActionClearKeyType = typeof actionClearKey;
  type ActionClearTypeType = typeof actionTypeClear;

  const actionClearCreator = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

  // type ActionClearMapType = MapKeyToCreator<{ t: typeof actionClearCreator }, ActionClearKeyType>;

  (bundle as any)[actionClearKey] = actionClearCreator;

  return bundle as typeof bundle & Record<ActionClearKeyType, typeof actionClearCreator>;
}

// tslint:disable-next-line:typedef
function createActionStreamBundle<T>(this: any, bundle: T) {
  const bundleEntries = Object.entries(bundle);
  const result = {} as any;
  for (const [key, value] of bundleEntries) {
    Object.defineProperty(result, `${key}\$`, {
      // tslint:disable-next-line:typedef
      get() {
        return this.$internal.actions$.pipe(ofType(value.type));
      },
      enumerable: true
    });
  }

  return result as {
    [K in keyof T & string as `${K}\$`]:
    Observable<T[K] extends (...args: any) => any ? ReturnType<T[K]> : never>
  };
}

// tslint:disable-next-line:typedef
function createActionDispatchBundle<T>(this: any, bundle: T) {

  const result = {} as any;
  const bundleEntries = Object.entries(bundle);
  for (const [key, value] of bundleEntries) {
    Object.defineProperty(result, key, {
      // tslint:disable-next-line:typedef
      get() {
        return (payload: any) => this.$internal.dispatch(value(payload));
      }
    });
  }

  return result as {
    [K in keyof T]:
    T[K] extends (payload: infer P) => { payload: any } & TypedAction<any> ?
    (payload: P) => void : T[K] extends (...args: infer F) => TypedAction<any> ? (...args: F) => void :
    T[K] extends () => TypedAction<any> ? () => TypedAction<any> : never;
  };
}

// tslint:disable-next-line:typedef
export function createAsyncBundle<
  Name extends string,
  Namespace extends string,
  Action = void,
  ActionSuccess = void,
  ActionFailure = void,
  ActionCancel = void
>(name: Name, ns: Namespace) {
  const bundle = createAsyncActionBundle<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel>(name, ns);
  const listen = createActionStreamBundle(bundle);
  const dispatch = createActionDispatchBundle(bundle);

  return { listen, dispatch, creators: bundle };
}

// tslint:disable-next-line:typedef
export function createAsyncBundleWithClear<
  Name extends string,
  Namespace extends string,
  Action = void,
  ActionSuccess = void,
  ActionFailure = void,
  ActionCancel = void,
  ActionClear = void
>(name: Name, ns: Namespace) {
  const bundle = createAsyncActionBundleWithClear<
    Name,
    Namespace,
    Action,
    ActionSuccess,
    ActionFailure,
    ActionCancel,
    ActionClear
  >(name, ns);
  const listen = createActionStreamBundle(bundle);
  const dispatch = createActionDispatchBundle(bundle);

  return { listen, dispatch, creators: bundle };
}

// tslint:disable-next-line:typedef
export function createBundle<
  Name extends string,
  Namespace extends string,
  Action = void
>(name: Name, namespace: Namespace) {
  const bundle = createAction<Name, Namespace, Action>(name, namespace);

  const listen = createActionStreamBundle(bundle);
  const dispatch = createActionDispatchBundle(bundle);

  return { listen, dispatch, creators: bundle };
}

// tslint:disable-next-line:typedef
export function createBundleWithClear<
  Name extends string,
  Namespace extends string,
  Action = void,
  ActionClear = void
>(name: Name, namespace: Namespace) {
  const bundle = createActionWithClear<Name, Namespace, Action, ActionClear>(name, namespace);

  const listen = createActionStreamBundle(bundle);
  const dispatch = createActionDispatchBundle(bundle);

  return { listen, dispatch, creators: bundle };
}
