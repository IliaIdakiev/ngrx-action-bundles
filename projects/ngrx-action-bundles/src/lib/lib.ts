import { ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { MapKeyToCreator, WithDispatchAndListenResult } from './types';
import { createUniqueAction, makeActionKeyWithSuffix, makeNamespacedActionKey } from './utils';

// tslint:disable-next-line:typedef
export function createAsyncActionBundle<
  Name extends string,
  Namespace extends string,
  Action,
  ActionSuccess,
  ActionFailure,
  ActionCancel
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


  type ActionMapType = MapKeyToCreator<{ t: typeof actionCreator }, ActionKeyType>;
  type ActionSuccessMapType = MapKeyToCreator<{ t: typeof actionSuccessCreator }, ActionSuccessKeyType>;
  type ActionFailureMapType = MapKeyToCreator<{ t: typeof actionFailureCreator }, ActionFailureKeyType>;
  type ActionCancelMapType = MapKeyToCreator<{ t: typeof actionCancelCreator }, ActionCancelKeyType>;

  type ActionBundle = ActionMapType & ActionSuccessMapType & ActionFailureMapType & ActionCancelMapType;

  const result = {
    [actionKey]: actionCreator,
    [actionSuccessKey]: actionSuccessCreator,
    [actionFailureKey]: actionFailureCreator,
    [actionCancelKey]: actionCancelCreator
  };

  return result as ActionBundle;
}

export type AsyncActionBundleResult = ReturnType<typeof createAsyncActionBundle>;

// tslint:disable-next-line:typedef
export function createAsyncActionBundleWithClear<
  Name extends string,
  Namespace extends string,
  Action,
  ActionSuccess,
  ActionFailure,
  ActionCancel,
  ActionClear
>(name: Name, ns: Namespace) {
  const bundle = createAsyncActionBundle<Name, Namespace, Action, ActionSuccess, ActionFailure, ActionCancel>(name, ns);
  const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');
  const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

  type ActionClearKeyType = typeof actionClearKey;
  type ActionClearTypeType = typeof actionTypeClear;

  const actionClearCreator = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

  type ActionClearMapType = MapKeyToCreator<{ t: typeof actionClearCreator }, ActionClearKeyType>;

  (bundle as any)[actionClearKey] = actionClearCreator;

  return bundle as typeof bundle & ActionClearMapType;
}

export type AsyncActionBundleWithClearResult = ReturnType<typeof createAsyncActionBundleWithClear>;


// tslint:disable-next-line:typedef
export function createActionStreamBundle<T>(this: any, bundle: T) {
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
    T[K] extends (payload: infer P) => { payload: any } & TypedAction<any> ? (payload: P) => void : never
  };
}

export function withDispatchAndListen<T>(bundle: T): WithDispatchAndListenResult<T> {

  const listen = createActionStreamBundle(bundle);
  const dispatch = createActionDispatchBundle(bundle);

  return { listen, dispatch };
}
