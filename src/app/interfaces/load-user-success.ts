import { ObjectWithTimestamp } from 'ngrx-action-bundles';
import { IUser } from './user';

export interface ILoadUsersSuccessWithCustomTimestampPayload {
  users: IUser[];
  timestamp: string;
}

export interface ILoadUsersSuccessWithDefaultTimestampPayload {
  users: IUser[];
}

export interface ILoadUsersSuccessWithNoTimestampPayload {
  users: IUser[];
}
