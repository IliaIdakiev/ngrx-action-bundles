import { Action } from '@ngrx/store';

export interface IAction<T = any> extends Action {
  payload: T;
}
