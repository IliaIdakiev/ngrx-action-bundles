import { props } from '@ngrx/store';
import { forNamespace } from 'ngrx-action-bundles';
import { IUser } from '../interfaces';

const factory = forNamespace('MAIN');

export const loadUsers = factory.asyncAction(
  'loadUsers',
  undefined,
  props<{ users: IUser[]; }>(),
  props<{ error: any; }>(),
  undefined
);

export const loadUsersTimestamp = factory.asyncAction(
  'loadUsersWithTimestamp',
  undefined,
  props<{ users: IUser[]; timestamp: number; }>(),
  props<{ error: any; timestamp: number; }>(),
  undefined,
  true
);

export const setItem = factory.singleActionWithCleanup(
  'setItem',
  props<{ item: string }>()
);

export const singleAction = factory.singleAction('test', props<{ value: any }>());

export const loadUsers2 = factory.asyncActionWithCleanup(
  'loadUsers2',
  undefined,
  props<{ users: IUser[]; }>(),
  props<{ error: any; }>(),
  undefined,
  undefined
);

export const loadUsersTimestampWith2 = factory.asyncActionWithCleanup(
  'loadUsersWithTimestamp2',
  undefined,
  props<{ users: IUser[]; timestamp: number; }>(),
  props<{ error: any; timestamp: number; }>(),
  undefined,
  undefined,
  true
);

export const bundles = [
  loadUsers,
  setItem,
  loadUsersTimestamp,
  singleAction,
  loadUsers2,
  loadUsersTimestampWith2
] as const;