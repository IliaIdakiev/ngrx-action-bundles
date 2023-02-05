import { createReducer, on } from '@ngrx/store';
import { loadUsers, loadUsers2, loadUsersTimestamp, loadUsersTimestampWith2, setItem } from './bundles';
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
    loadUsersTimestamp.loadUsersWithTimestamp,
    loadUsers2.loadUsers2,
    loadUsersTimestampWith2.loadUsersWithTimestamp2,
    (state: IMainState) => ({ ...state, userList: null })
  ),
  on(
    loadUsers.loadUsersSuccess,
    loadUsersTimestamp.loadUsersWithTimestampSuccess,
    loadUsers2.loadUsers2Success,
    loadUsersTimestampWith2.loadUsersWithTimestamp2Success,
    (state, action) => {
      const { users } = action;
      if ('timestamp' in action) {
        console.log('Load user success timestamp is:', action.timestamp);
      }
      return { ...state, userList: users }
    }
  ),
  on(
    loadUsers.loadUsersFailure,
    loadUsersTimestamp.loadUsersWithTimestampFailure,
    loadUsers2.loadUsers2Failure,
    loadUsersTimestampWith2.loadUsersWithTimestamp2Failure,
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
    loadUsers2.loadUsers2Cleanup,
    loadUsersTimestampWith2.loadUsersWithTimestamp2Cleanup,
    (state) => ({ ...state, item: null })
  )
);
