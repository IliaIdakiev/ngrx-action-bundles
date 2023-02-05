import { createReducer, on } from '@ngrx/store';
import { loadUsers, setItem } from './bundles';
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
    loadUsers.loadUsers,
    (state: IMainState) => ({ ...state, userList: null })
  ),
  on(
    loadUsers.loadUsersSuccess,
    (state, { users }) => {
      return { ...state, userList: users }
    }
  ),
  on(
    loadUsers.loadUsersFailure,
    (state, { error }) => {
      return { ...state, error };
    }
  ),
  on(
    setItem.setItem,
    (state, { item }) => {
      return { ...state, item };
    }
  ),
  on(
    setItem.setItemCleanup,
    (state) => ({ ...state, item: null })
  )
);
