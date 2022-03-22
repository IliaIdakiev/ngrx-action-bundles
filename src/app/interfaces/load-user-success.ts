import { ObjectWithTimestamp } from 'ngrx-action-bundles';
import { IUser } from './user';

export interface ILoadUsersSuccessWithCustomTimestampPayload extends ObjectWithTimestamp<string> {
  users: IUser[];
}

export interface ILoadUsersSuccessWithDefaultTimestampPayload extends ObjectWithTimestamp {
  users: IUser[];
}

export interface ILoadUsersSuccessWithNoTimestampPayload {
  users: IUser[];
}
