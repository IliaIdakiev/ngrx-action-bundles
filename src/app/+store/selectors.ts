import { createSelector } from '@ngrx/store';
import { IRootState } from './index';
import { IMainState } from './reducers';

export const selectMain = (state: IRootState) => state.main;

export const selectMainUserList = createSelector(
  selectMain,
  (state: IMainState) => state.userList
);

export const selectMainItem = createSelector(
  selectMain,
  (state: IMainState) => state.item
);

export const selectors = {
  userList: selectMainUserList,
  item: selectMainItem
};
