import { props } from '@ngrx/store';
import { forNamespace } from 'ngrx-action-bundles';
import { IUser } from '../interfaces';

const factory = forNamespace('MAIN');

export const loadUsers = factory.asyncAction(
  'loadUsers',
  undefined,
  props<{ users: IUser[] }>(),
  props<{ error: any }>(),
  undefined
);

export const setItem = factory.singleActionWithCleanup(
  'setItem',
  props<{ item: string }>()
);

export const bundles = [
  loadUsers,
  setItem
] as const;