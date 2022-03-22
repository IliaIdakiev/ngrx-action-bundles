import { createReducer, on } from '@ngrx/store';
import { loadUsersWithCustomTimestampBundle, loadUsersWithDefaultTimestampBundle, loadUsersWithNoTimestampBundle, itemBundle } from './bundles';
import { IUser } from '../interfaces';

export interface IMainState {
  userList: IUser[] | null;
  error: string | null;
  item: any;
}

export const initialState: IMainState = {
  userList: null,
  error: null,
  item: null
};

export const mainReducer = createReducer<IMainState>(
  initialState,
  on(
    loadUsersWithCustomTimestampBundle.creators.loadUsersWithCustomTimestamp,
    loadUsersWithDefaultTimestampBundle.creators.loadUsersWithDefaultTimestamp,
    loadUsersWithNoTimestampBundle.creators.loadUsersWithNoTimestamp,
    (state) => {
      return { ...state, userList: null };
    }),
  on(
    loadUsersWithCustomTimestampBundle.creators.loadUsersWithCustomTimestampSuccess,
    loadUsersWithDefaultTimestampBundle.creators.loadUsersWithDefaultTimestampSuccess,
    loadUsersWithNoTimestampBundle.creators.loadUsersWithNoTimestampSuccess,
    (state, { payload: { users } }) => {
      return { ...state, userList: users };
    }),
  on(
    loadUsersWithCustomTimestampBundle.creators.loadUsersWithCustomTimestampFailure,
    loadUsersWithDefaultTimestampBundle.creators.loadUsersWithDefaultTimestampFailure,
    loadUsersWithNoTimestampBundle.creators.loadUsersWithNoTimestampFailure,
    (status, { payload: { error: { message } } }) => {
      return { ...status, error: message };
    }),
  on(
    loadUsersWithCustomTimestampBundle.creators.loadUsersWithCustomTimestampClear,
    loadUsersWithDefaultTimestampBundle.creators.loadUsersWithDefaultTimestampClear,
    loadUsersWithNoTimestampBundle.creators.loadUsersWithNoTimestampClear,
    (status) => {
      return { ...status, userList: null };
    }),
  on(itemBundle.creators.setItem, (state, { payload: { item } }) => {
    return { ...state, item };
  }),
  on(itemBundle.creators.clearItem, (state) => {
    return { ...state, item: null };
  })
);
