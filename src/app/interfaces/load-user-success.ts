import { ObjectWithTimestamp } from 'ngrx-action-bundles';
import { IUser } from './user';

export interface ILoadUsersSuccessPayload extends ObjectWithTimestamp {
  users: IUser[];
}
