import { createAction } from '@ngrx/store';
import { ObjectWithTimestamp } from '../types';
import { actionType } from './action-type';
import { createTimestamp } from './create-timestamp';

export const createUniqueAction = <T extends string, P>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);

export const createUniqueRequiredTimestampAction = <
  T extends string, P extends ObjectWithTimestamp<any> = { timestamp: number }
>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);

export const createUniqueTimestampAction = <
  T extends string, P extends Partial<ObjectWithTimestamp<any>> | void = { timestamp?: number }
>(type: T) => <PP extends ObjectWithTimestamp<any> = { timestamp: number }>(payload: P) => {
  return createAction(
    actionType<T>(type),
    (payload: PP) => {
      if (payload && !payload?.timestamp) {
        payload['timestamp'] = createTimestamp();
      }
      return ({ payload })
    }
  )(payload as unknown as PP);
}

type kur = ReturnType<typeof createUniqueTimestampAction<'aaa'>>;
const a: kur = {} as any;

const b = a({});
b.payload
