import { createSelector } from '@ngrx/store';
import { IRootState } from './index';
import { IMainState } from './reducers';

const selectMain = (state: IRootState) => state.main;

export const userList = createSelector(
  selectMain,
  (state: IMainState) => state.userList
);

export const item = createSelector(
  selectMain,
  (state: IMainState) => state.item
);
