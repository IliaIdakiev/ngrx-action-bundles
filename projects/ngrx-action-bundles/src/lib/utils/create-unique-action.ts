import { createAction } from '@ngrx/store';
import { ObjectWithTimestamp } from '../types';
import { actionType } from './action-type';
import { createTimestamp } from './create-timestamp';

export const createUniqueAction = <T extends string, P>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);

export const createUniqueOptionalTimestampAction = <T extends string, P>(type: T) => createAction(
  actionType<T>(type), (payload: P extends ObjectWithTimestamp<infer TTT> ? P : void) =>
  ({ payload: { ...payload, timestamp: payload?.timestamp || createTimestamp() } }) as {
    payload: P & { timestamp: P extends ObjectWithTimestamp<infer TTT> ? TTT : number };
  }
);

export const createUniqueTimestampRequiredAction = <T extends string, P extends ObjectWithTimestamp>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);
