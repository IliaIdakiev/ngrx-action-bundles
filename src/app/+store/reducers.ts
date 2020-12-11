import { createReducer, on } from '@ngrx/store';
import { loadUsers } from './actions';
import { IUser } from '../interfaces';

export interface IUserListState {
  userList: IUser[] | null;
}

export const initialState: IUserListState = {
  userList: null
};

export const userListReducer = createReducer<IUserListState>(
  initialState,
  on(loadUsers.loadUsersSuccess, (state, action) => {
    return { ...state, userList: action.payload.users };
  }),
  on(loadUsers.loadUsersClear, (status) => {
    return { ...status, userList: null };
  })
);
