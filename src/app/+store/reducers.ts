import { createReducer, on } from '@ngrx/store';
import { loadUsers } from './actions';
import { IUser } from '../interfaces';

export interface IUserListState {
  userList: IUser[] | null;
  error: string | null;
  item: any;
}

export const initialState: IUserListState = {
  userList: null,
  error: null,
  item: null
};

export const userListReducer = createReducer<IUserListState>(
  initialState,
  on(loadUsers.loadUsers, (state) => {
    return { ...state, userList: null };
  }),
  on(loadUsers.loadUsersSuccess, (state, { payload: { users } }) => {
    return { ...state, userList: users };
  }),
  on(loadUsers.loadUsersFailure, (status, { payload: { error: { message } } }) => {
    return { ...status, error: message };
  }),
  on(loadUsers.loadUsersClear, (status) => {
    return { ...status, userList: null };
  })
);
