import { createReducer, on } from '@ngrx/store';
import { loadUsersBundle, itemBundle } from './bundles';
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
  on(loadUsersBundle.creators.loadUsers, (state) => {
    return { ...state, userList: null };
  }),
  on(loadUsersBundle.creators.loadUsersSuccess, (state, { payload: { users } }) => {
    return { ...state, userList: users };
  }),
  on(loadUsersBundle.creators.loadUsersFailure, (status, { payload: { error: { message } } }) => {
    return { ...status, error: message };
  }),
  on(loadUsersBundle.creators.loadUsersClear, (status) => {
    return { ...status, userList: null };
  }),
  on(itemBundle.creators.setItem, (state, { payload: { item } }) => {
    return { ...state, item };
  }),
  on(itemBundle.creators.clearItem, (state) => {
    return { ...state, item: null };
  })
);
