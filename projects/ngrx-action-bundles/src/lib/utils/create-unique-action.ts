import { createAction } from '@ngrx/store';
import { actionType } from './action-type';

export const createUniqueAction = <T extends string, P>(type: T) => createAction(
  actionType<T>(type),
  (payload: P) => ({ payload })
);
