import { createSelector } from '@ngrx/store';
import { IRootState } from './index';
import { IUserListState } from './reducers';

export const selectUser = (state: IRootState) => state.user;

export const selectUserList = createSelector(
  selectUser,
  (state: IUserListState) => state.userList
);
