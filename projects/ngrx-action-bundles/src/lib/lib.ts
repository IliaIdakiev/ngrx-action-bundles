import { ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { ObjectWithTimestamp, Timestamp } from './types';
import {
  capitalize,
  createUniqueAction,
  createUniqueRequiredTimestampAction,
  createUniqueTimestampAction,
  makeActionKeyWithSuffix,
  makeNamespacedActionKey
} from './utils';

// tslint:disable-next-line:typedef
function createAction<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action>() {
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
}

// tslint:disable-next-line:typedef
function createTimestampAction<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action extends ObjectWithTimestamp>() {
    const actionKey = makeActionKeyWithSuffix(name, '');
    type ActionKeyType = typeof actionKey;

    const actionType = makeNamespacedActionKey(namespace, actionKey);
    type ActionTypeType = typeof actionType;

    const actionCreator = createUniqueTimestampAction<ActionTypeType, Action>(actionType);

    type ActionBundle = Record<ActionKeyType, typeof actionCreator>;

    const result = {
      [actionKey]: actionCreator
    };

    return result as ActionBundle;
  }
}

// tslint:disable-next-line:typedef
function createActionWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action, ActionClear>() {
    const actionKey = makeActionKeyWithSuffix('set', capitalize(name));
    const actionClearKey = makeActionKeyWithSuffix('clear', capitalize(name));

    type ActionKeyType = typeof actionKey;
    type ActionClearKeyType = typeof actionClearKey;

    const actionType = makeNamespacedActionKey(namespace, actionKey);
    const actionTypeClear = makeNamespacedActionKey(namespace, actionClearKey);

    type ActionTypeType = typeof actionType;
    type ActionCancelTypeType = typeof actionTypeClear;

    const actionCreator = createUniqueAction<ActionTypeType, Action>(actionType);
    const actionClearCreator = createUniqueAction<ActionCancelTypeType, ActionClear>(actionTypeClear);

    type ActionBundle = Record<ActionKeyType, typeof actionCreator> & Record<ActionClearKeyType, typeof actionClearCreator>;

    const result = {
      [actionKey]: actionCreator,
      [actionClearKey]: actionClearCreator
    };

    return result as ActionBundle;
  }
}

// tslint:disable-next-line:typedef
function createTimestampActionWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action extends ObjectWithTimestamp, ActionClear>() {
    const actionKey = makeActionKeyWithSuffix('set', capitalize(name));
    const actionClearKey = makeActionKeyWithSuffix('clear', capitalize(name));

    type ActionKeyType = typeof actionKey;
    type ActionClearKeyType = typeof actionClearKey;

    const actionType = makeNamespacedActionKey(namespace, actionKey);
    const actionTypeClear = makeNamespacedActionKey(namespace, actionClearKey);

    type ActionTypeType = typeof actionType;
    type ActionClearTypeType = typeof actionTypeClear;

    const actionCreator = createUniqueTimestampAction<ActionTypeType, Action>(actionType);
    const actionClearCreator = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

    type ActionBundle = Record<ActionKeyType, typeof actionCreator> & Record<ActionClearKeyType, typeof actionClearCreator>;

    const result = {
      [actionKey]: actionCreator,
      [actionClearKey]: actionClearCreator
    };

    return result as ActionBundle;
  }
}

// tslint:disable-next-line:typedef
function createAsyncActionBundle<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {
  return function creator<Action = void, ActionSuccess = void, ActionFailure = void, ActionCancel = void>() {
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
}

function createAsyncTimestampActionBundle<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace): <
  Action extends Partial<ObjectWithTimestamp<any>> = { timestamp?: number },
  ActionSuccess extends ObjectWithTimestamp<Action['timestamp']> = { timestamp: number },
  ActionFailure extends ObjectWithTimestamp<Action['timestamp']> = { timestamp: number },
  ActionCancel extends ObjectWithTimestamp<Action['timestamp']> = { timestamp: number },
>() =>
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, ''>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Action & { timestamp: U }>> :
      ReturnType<typeof createUniqueTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Action & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Success'>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Omit<ActionSuccess, 'timestamp'> & { timestamp: U }>> :
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionSuccess & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Failure'>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Omit<ActionFailure, 'timestamp'> & { timestamp: U }>> :
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionFailure & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Cancel'>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Omit<ActionCancel, 'timestamp'> & { timestamp: U }>> :
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionCancel & { timestamp: Action['timestamp'] }>>
    >;
function createAsyncTimestampActionBundle(name: string, ns: string) {
  return function creator() {
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
  }
}
// TODO: REMOVE THIS:
// function createAsyncTimestampActionBundle<
//   Name extends string,
//   Namespace extends string
// >(name: Name, ns: Namespace) {
//   return function creator<
//     Action,
//     ActionSuccess,
//     ActionFailure,
//     ActionCancel,
//   >() {
//     const actionKey = makeActionKeyWithSuffix(name, '');
//     const actionSuccessKey = makeActionKeyWithSuffix(name, 'Success');
//     const actionFailureKey = makeActionKeyWithSuffix(name, 'Failure');
//     const actionCancelKey = makeActionKeyWithSuffix(name, 'Cancel');

//     type ActionKeyType = typeof actionKey;
//     type ActionSuccessKeyType = typeof actionSuccessKey;
//     type ActionFailureKeyType = typeof actionFailureKey;
//     type ActionCancelKeyType = typeof actionCancelKey;

//     const actionType = makeNamespacedActionKey(ns, actionKey);
//     const actionTypeSuccess = makeNamespacedActionKey(ns, actionSuccessKey);
//     const actionTypeFailure = makeNamespacedActionKey(ns, actionFailureKey);
//     const actionTypeCancel = makeNamespacedActionKey(ns, actionCancelKey);

//     type ActionTypeType = typeof actionType;
//     type ActionSuccessTypeType = typeof actionTypeSuccess;
//     type ActionFailureTypeType = typeof actionTypeFailure;
//     type ActionCancelTypeType = typeof actionTypeCancel;

//     const actionCreator = createUniqueTimestampAction<ActionTypeType, Action>(actionType);
//     const actionSuccessCreator = createUniqueRequiredTimestampAction<ActionSuccessTypeType, ActionSuccess & { timestamp: Action['timestamp'] }>(actionTypeSuccess);
//     const actionFailureCreator = createUniqueRequiredTimestampAction<ActionFailureTypeType, ActionFailure>(actionTypeFailure);
//     const actionCancelCreator = createUniqueRequiredTimestampAction<ActionCancelTypeType, ActionCancel>(actionTypeCancel);

//     type ActionBundle =
//       Record<ActionKeyType, typeof actionCreator> &
//       Record<ActionSuccessKeyType, typeof actionSuccessCreator> &
//       Record<ActionFailureKeyType, typeof actionFailureCreator> &
//       Record<ActionCancelKeyType, typeof actionCancelCreator>;

//     const result = {
//       [actionKey]: actionCreator,
//       [actionSuccessKey]: actionSuccessCreator,
//       [actionFailureKey]: actionFailureCreator,
//       [actionCancelKey]: actionCancelCreator
//     };

//     return result as ActionBundle;
//   }
// }

// // TEST - no generics
// var a = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')();
// a.hello()
// a.hello({ timestamp: 123 });
// a.hello({ timestamp: '3213' }); // error

// a.helloSuccess({ timestamp: 213 });
// a.helloSuccess({ timestamp: '123' }); // error
// a.helloSuccess({}); /// error
// a.helloSuccess(); /// error

// a.helloFailure({ timestamp: 213 });
// a.helloFailure({ timestamp: '123' }); // error
// a.helloFailure({}); /// error
// a.helloFailure(); /// error

// a.helloCancel({ timestamp: 213 });
// a.helloCancel({ timestamp: '123' }); // error
// a.helloCancel({}); /// error
// a.helloCancel(); /// error

// // TEST - custom timestamp
// var a1 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number }
// >();
// a1.hello({ timestamp: true, test: 123 });
// a1.hello({}); //error
// a1.hello(); //error
// a1.hello({ timestamp: 13 }); //error
// a1.hello({ timestamp: 13, test: '321' }); //error

// a1.helloSuccess({ timestamp: true });
// a1.helloSuccess({ timestamp: true, test: 123 }); //error
// a1.helloSuccess({ timestamp: 123 }) // error
// a1.helloSuccess({}) // error
// a1.helloSuccess() // error

// a1.helloFailure({ timestamp: true });
// a1.helloFailure({ timestamp: 123 }) // error
// a1.helloFailure({}) // error
// a1.helloFailure() // error

// a1.helloCancel({ timestamp: true });
// a1.helloCancel({ timestamp: 123 }) // error
// a1.helloCancel({}) // error
// a1.helloCancel() // error


// // TEST - custom timestamp 2
// var a22 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: number, users: { name: string }[] }
// >(); // error
// var a222 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string }[] },
//   { timestamp: string, test: boolean }
// >(); // error
// var a2222 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string }[] },
//   { timestamp: boolean, test: boolean },
//   { timestamp: string, test: boolean }
// >(); // error

// var a2 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] }
// >(); // error

// a2.hello({ timestamp: true, test: 123 });
// a2.hello({}); //error
// a2.hello(); //error
// a2.hello({ timestamp: 13 }); //error
// a2.hello({ timestamp: 13, test: '321' }); //error

// a2.helloSuccess({ timestamp: true, users: [{ name: '213', age: 20 }] });
// a2.helloSuccess({ timestamp: true, test: 123 }); //error
// a2.helloSuccess({ timestamp: 123 }) // error
// a2.helloSuccess({}) // error
// a2.helloSuccess() // error

// a2.helloFailure({ timestamp: true });
// a2.helloFailure({ timestamp: 123 }) // error
// a2.helloFailure({}) // error
// a2.helloFailure() // error

// a2.helloCancel({ timestamp: true });
// a2.helloCancel({ timestamp: 123 }) // error
// a2.helloCancel({}) // error
// a2.helloCancel() // error

// var a3 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] },
//   { timestamp: boolean, validate: boolean }
// >();

// a3.helloFailure({ validate: true, timestamp: true });
// a3.helloFailure(); // error
// a3.helloFailure({}); // error
// a3.helloFailure({ validate: true }); // error

// var a4 = createAsyncTimestampActionBundle<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] },
//   { timestamp: boolean, validate: boolean },
//   { timestamp: boolean, age: number }
// >();

// a4.helloCancel({ timestamp: true, age: 30 });
// a4.helloCancel(); // error
// a4.helloCancel({}); // error
// a4.helloCancel({ age: 20 }); // error


// tslint:disable-next-line:typedef
function createAsyncActionBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace) {

  return function creator<Action = void,
    ActionSuccess = void,
    ActionFailure = void,
    ActionCancel = void,
    ActionClear = void
  >() {
    const bundle = createAsyncActionBundle<Name, Namespace>(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel>();
    const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');
    const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

    type ActionClearKeyType = typeof actionClearKey;
    type ActionClearTypeType = typeof actionTypeClear;

    const actionClearCreator = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

    (bundle as any)[actionClearKey] = actionClearCreator;

    return bundle as typeof bundle & Record<ActionClearKeyType, typeof actionClearCreator>;
  }

}

function createAsyncTimestampActionBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, ns: Namespace): <
  Action extends Partial<ObjectWithTimestamp<any>> = { timestamp?: number },
  ActionSuccess extends ObjectWithTimestamp<Action['timestamp']> = { timestamp: number },
  ActionFailure extends ObjectWithTimestamp<Action['timestamp']> = { timestamp: number },
  ActionCancel extends ObjectWithTimestamp<Action['timestamp']> = { timestamp: number },
  ActionClear extends any = void,
>() =>
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, ''>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Action & { timestamp: U }>> :
      ReturnType<typeof createUniqueTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Action & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Success'>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Omit<ActionSuccess, 'timestamp'> & { timestamp: U }>> :
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionSuccess & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Failure'>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Omit<ActionFailure, 'timestamp'> & { timestamp: U }>> :
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionFailure & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Cancel'>>,
      Action extends { timestamp: infer U } ?
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, Omit<ActionCancel, 'timestamp'> & { timestamp: U }>> :
      ReturnType<typeof createUniqueRequiredTimestampAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionCancel & { timestamp: Action['timestamp'] }>>
    > &
    Record<
      ReturnType<typeof makeActionKeyWithSuffix<Name, 'Clear'>>,
      ActionClear extends void ? ReturnType<typeof createUniqueAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, void>> :
      ReturnType<typeof createUniqueAction<ReturnType<typeof makeNamespacedActionKey<Namespace, Name>>, ActionClear>>
    >;
function createAsyncTimestampActionBundleWithClear(name: string, ns: string) {
  return function creator() {
    const bundle = createAsyncTimestampActionBundle(name, ns)();
    const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');
    const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

    const actionClearCreator = createUniqueAction(actionTypeClear);
    (bundle as any)[actionClearKey] = actionClearCreator;
    return bundle as any;
  }
}
// // TEST - no generics
// var a = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')();
// a.hello()
// a.hello({ timestamp: 123 });
// a.hello({ timestamp: '3213' }); // error

// a.helloSuccess({ timestamp: 213 });
// a.helloSuccess({ timestamp: '123' }); // error
// a.helloSuccess({}); /// error
// a.helloSuccess(); /// error

// a.helloFailure({ timestamp: 213 });
// a.helloFailure({ timestamp: '123' }); // error
// a.helloFailure({}); /// error
// a.helloFailure(); /// error

// a.helloCancel({ timestamp: 213 });
// a.helloCancel({ timestamp: '123' }); // error
// a.helloCancel({}); /// error
// a.helloCancel(); /// error

// // TEST - custom timestamp
// var a1 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number }
// >();
// a1.hello({ timestamp: true, test: 123 });
// a1.hello({}); //error
// a1.hello(); //error
// a1.hello({ timestamp: 13 }); //error
// a1.hello({ timestamp: 13, test: '321' }); //error

// a1.helloSuccess({ timestamp: true });
// a1.helloSuccess({ timestamp: true, test: 123 }); //error
// a1.helloSuccess({ timestamp: 123 }) // error
// a1.helloSuccess({}) // error
// a1.helloSuccess() // error

// a1.helloFailure({ timestamp: true });
// a1.helloFailure({ timestamp: 123 }) // error
// a1.helloFailure({}) // error
// a1.helloFailure() // error

// a1.helloCancel({ timestamp: true });
// a1.helloCancel({ timestamp: 123 }) // error
// a1.helloCancel({}) // error
// a1.helloCancel() // error


// // TEST - custom timestamp 2
// var a22 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: number, users: { name: string }[] }
// >(); // error
// var a222 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string }[] },
//   { timestamp: string, test: boolean }
// >(); // error
// var a2222 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string }[] },
//   { timestamp: boolean, test: boolean },
//   { timestamp: string, test: boolean }
// >(); // error

// var a2 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] }
// >(); // error

// a2.hello({ timestamp: true, test: 123 });
// a2.hello({}); //error
// a2.hello(); //error
// a2.hello({ timestamp: 13 }); //error
// a2.hello({ timestamp: 13, test: '321' }); //error

// a2.helloSuccess({ timestamp: true, users: [{ name: '213', age: 20 }] });
// a2.helloSuccess({ timestamp: true, test: 123 }); //error
// a2.helloSuccess({ timestamp: 123 }) // error
// a2.helloSuccess({}) // error
// a2.helloSuccess() // error

// a2.helloFailure({ timestamp: true });
// a2.helloFailure({ timestamp: 123 }) // error
// a2.helloFailure({}) // error
// a2.helloFailure() // error

// a2.helloCancel({ timestamp: true });
// a2.helloCancel({ timestamp: 123 }) // error
// a2.helloCancel({}) // error
// a2.helloCancel() // error

// var a3 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] },
//   { timestamp: boolean, validate: boolean }
// >();

// a3.helloFailure({ validate: true, timestamp: true });
// a3.helloFailure(); // error
// a3.helloFailure({}); // error
// a3.helloFailure({ validate: true }); // error

// var a4 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] },
//   { timestamp: boolean, validate: boolean },
//   { timestamp: boolean, age: number }
// >();

// a4.helloCancel({ timestamp: true, age: 30 });
// a4.helloCancel(); // error
// a4.helloCancel({}); // error
// a4.helloCancel({ age: 20 }); // error

// var a3 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] },
//   { timestamp: boolean, validate: boolean }
// >();

// a3.helloFailure({ validate: true, timestamp: true });
// a3.helloFailure(); // error
// a3.helloFailure({}); // error
// a3.helloFailure({ validate: true }); // error

// var a5 = createAsyncTimestampActionBundleWithClear<'hello', 'test'>('hello', 'test')<
//   { timestamp: boolean, test: number },
//   { timestamp: boolean, users: { name: string, age: number }[] },
//   { timestamp: boolean, validate: boolean },
//   { timestamp: boolean, age: number },
//   { testingThisShit: { test: number } }
// >();

// a5.helloClear({ testingThisShit: { test: 13 } });
// a5.helloClear({ testingThisShit: { test: '13' } }); // error
// a5.helloClear({ timestamp: true, age: 30 }); // error
// a5.helloClear(); // error
// a5.helloClear({}); // error

// TODO: REMOVE THIS
// function createAsyncTimestampActionBundleWithClear<
//   Name extends string,
//   Namespace extends string
// >(name: Name, ns: Namespace) {

//   return function creator<
//     Action = void,
//     ActionSuccess extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = { timestamp: number } & any,
//     ActionFailure extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = { timestamp: number } & any,
//     ActionCancel extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = { timestamp: number } & any,
//     ActionClear = void,
//   >() {
//     const bundle = createAsyncTimestampActionBundle<Name, Namespace>(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel>();
//     const actionClearKey = makeActionKeyWithSuffix(name, 'Clear');
//     const actionTypeClear = makeNamespacedActionKey(ns, actionClearKey);

//     type ActionClearKeyType = typeof actionClearKey;
//     type ActionClearTypeType = typeof actionTypeClear;

//     const actionClearCreator = createUniqueAction<ActionClearTypeType, ActionClear>(actionTypeClear);

//     (bundle as any)[actionClearKey] = actionClearCreator;

//     return bundle as typeof bundle & Record<ActionClearKeyType, typeof actionClearCreator>;
//   }

// }

// tslint:disable-next-line:typedef
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
    const bundle = createAsyncActionBundle<Name, Namespace>(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel>();
    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  }
}

// tslint:disable-next-line:typedef
export function createAsyncTimestampBundle<
  Name extends string,
  Namespace extends string,
>(name: Name, ns: Namespace) {
  return function creator<
    Action = void,
    ActionSuccess extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = any,
    ActionFailure extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = any,
    ActionCancel extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = any,
  >() {
    const bundle = createAsyncTimestampActionBundle<Name, Namespace>(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel>();
    const listen = createActionStreamBundleWithTimestamp<typeof bundle, ActionSuccess['timestamp']>(bundle);
    const dispatch = createActionDispatchBundleWithTimestamp<typeof bundle, ActionSuccess['timestamp']>(bundle);

    return { listen, dispatch, creators: bundle };
  }
}

// tslint:disable-next-line:typedef
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
    const bundle = createAsyncActionBundleWithClear<
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
    Action = void,
    ActionSuccess extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = any,
    ActionFailure extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = any,
    ActionCancel extends Action extends ObjectWithTimestamp<infer TT> ? ObjectWithTimestamp<TT> : ObjectWithTimestamp<number> = any,
    ActionClear = void
  >() {
    const bundle = createAsyncTimestampActionBundleWithClear<
      Name,
      Namespace
    >(name, ns)<Action, ActionSuccess, ActionFailure, ActionCancel, ActionClear>();
    const listen = createActionStreamBundleWithTimestamp<typeof bundle, ActionSuccess['timestamp']>(bundle);
    const dispatch = createActionDispatchBundleWithTimestamp(bundle);

    return { listen, dispatch, creators: bundle };
  }
}

// tslint:disable-next-line:typedef
export function createBundle<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {

  return function creator<Action = void>() {
    const bundle = createAction<Name, Namespace>(name, namespace)<Action>();

    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  };
}

// tslint:disable-next-line:typedef
export function createTimestampBundle<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {

  return function creator<Action = void>() {
    const bundle = createTimestampAction<Name, Namespace>(name, namespace)<Action>();

    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  };
}

// tslint:disable-next-line:typedef
export function createBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action = void, ActionClear = void>() {
    const bundle = createActionWithClear<Name, Namespace>(name, namespace)<Action, ActionClear>();

    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  };
}

// tslint:disable-next-line:typedef
export function createTimestampBundleWithClear<
  Name extends string,
  Namespace extends string
>(name: Name, namespace: Namespace) {
  return function creator<Action = void, ActionClear = void>() {
    const bundle = createTimestampActionWithClear<Name, Namespace>(name, namespace)<Action, ActionClear>();

    const listen = createActionStreamBundle(bundle);
    const dispatch = createActionDispatchBundle(bundle);

    return { listen, dispatch, creators: bundle };
  };
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
function createActionStreamBundleWithTimestamp<T, TT>(this: any, bundle: T) {
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
    Observable<T[K] extends (...args: any) => any ? { timestamp: Timestamp<TT> } & ReturnType<T[K]> : never>
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
        return (payload: any) => {
          const action = value(payload);
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

function createActionDispatchBundleWithTimestamp<T, TT>(this: any, bundle: T) {
  const result = {} as any;
  const bundleEntries = Object.entries(bundle);
  for (const [key, value] of bundleEntries) {
    Object.defineProperty(result, key, {
      // tslint:disable-next-line:typedef
      get() {
        return (payload: any) => {
          const action = value(payload);
          this.$internal.dispatch(action);
          return action;
        };
      }
    });
  }

  return result as {
    [K in keyof T]:
    T[K] extends (payload: infer P) => infer R ?
    (payload: P & { timestamp: TT }) => R : T[K] extends (...args: infer F) => infer R ? (...args: F) => R :
    T[K] extends () => infer R ? () => R : never;
  };
}
