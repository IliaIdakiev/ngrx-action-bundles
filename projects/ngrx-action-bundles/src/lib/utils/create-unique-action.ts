import { createAction } from '@ngrx/store';
import { ObjectWithTimestamp } from '../types';
import { actionType } from './action-type';
import { createTimestamp } from './create-timestamp';

export const createUniqueAction = <T extends string, P>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);

export const createUniqueOptionalTimestampAction = <T extends string, P, TT = number>(type: T) => createAction(
  actionType<T>(type), (payload: P extends ObjectWithTimestamp<TT> ? P : P) =>
  ({ payload: { ...payload, timestamp: (payload as any)?.timestamp || createTimestamp() } }) as {
    payload: P & { timestamp: TT };
  }
);

export const createUniqueTimestampRequiredAction = <T extends string, P extends ObjectWithTimestamp<TT> = ObjectWithTimestamp<any>, TT = number>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);
