import { createAction } from '@ngrx/store';
import { createTimestamp } from 'ngrx-action-bundles';
import { ObjectWithTimestamp } from '../types';
import { actionType } from './action-type';

export const createUniqueAction = <T extends string, P>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);

export const createUniqueTimestampAction = <
  T extends string, P extends Partial<ObjectWithTimestamp<any>> = { timestamp: number }
>(type: T) => createAction(
  actionType<T>(type),
  (payload?: P extends ObjectWithTimestamp<infer U> ? P & ObjectWithTimestamp<U> : P & Partial<{ timestamp: number }>) => {
    if (payload && !payload?.timestamp) {
      payload.timestamp = createTimestamp();
    }
    return ({ payload })
  }
);

// // TESTS
// const name = 'loadUsers[UserModule]';

// // 1 NO ERROR:
// const a11 = createUniqueTimestampAction<typeof name>(name)() // optional timestamp
// const a12 = createUniqueTimestampAction<typeof name>(name)({ timestamp: 123 }) // optional timestamp
// // 1 ERROR:
// const a13 = createUniqueTimestampAction<typeof name>(name)({}) // optional timestamp error
// const a14 = createUniqueTimestampAction<typeof name>(name)({ a: 1 }) // optional timestamp error
// const a15 = createUniqueTimestampAction<typeof name>(name)({ timestamp: '321' }) // optional timestamp error

// // 2 NO ERROR:
// const a22 = createUniqueTimestampAction<typeof name, { hello: 'world' }>(name)({ hello: 'world' }) // optional timestamp
// const a23 = createUniqueTimestampAction<typeof name, { hello: 'world', timestamp: 'a' }>(name)({ hello: 'world', timestamp: 'a' }) // optional timestamp

// // 2 ERROR:
// const a24 = createUniqueTimestampAction<typeof name, { hello: 'world' }>(name)({ hello: 213 }) // optional timestamp error
// const a25 = createUniqueTimestampAction<typeof name, { hello: 'world', timestamp: 'a' }>(name)({ hello: 'world', timestamp: 31 }) // optional timestamp

