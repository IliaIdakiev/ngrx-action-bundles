import { ActionReducerMap } from '@ngrx/store';
import { IUserListState } from './reducers';
import { userListReducer } from './reducers';

export interface IRootState {
  readonly user: IUserListState;
}

export const reducers: ActionReducerMap<IRootState> = {
  user: userListReducer
};
