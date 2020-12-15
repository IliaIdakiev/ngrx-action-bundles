import { ActionReducerMap } from '@ngrx/store';
import { IMainState } from './reducers';
import { mainReducer } from './reducers';

export interface IRootState {
  readonly main: IMainState;
}

export const reducers: ActionReducerMap<IRootState> = {
  main: mainReducer
};
