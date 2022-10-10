import { createAsyncBundleWithClear, createAsyncTimestampBundleWithClear, createBundleWithClear } from 'ngrx-action-bundles';
import { IUser } from '../interfaces';

const actionNamespace = '[MAIN]';

const loadUsersWithCustomTimestampActionName = 'loadUsersWithCustomTimestamp' as const;
const loadUsersWithDefaultTimestampActionName = 'loadUsersWithDefaultTimestamp' as const;
const loadUsersWithNoTimestampActionName = 'loadUsersWithNoTimestamp' as const;

export const loadUsersWithCustomTimestampBundle = createAsyncTimestampBundleWithClear(loadUsersWithCustomTimestampActionName, actionNamespace)<
  { timestamp: string },
  { users: IUser[] },
  { error: any; }
>();

export const loadUsersWithDefaultTimestampBundle = createAsyncTimestampBundleWithClear(loadUsersWithDefaultTimestampActionName, actionNamespace)<
  void,
  { users: IUser[]; },
  { error: any; }
>();

export const loadUsersWithNoTimestampBundle = createAsyncBundleWithClear(loadUsersWithNoTimestampActionName, actionNamespace)<
  void,
  { users: IUser[] },
  { error: any; }
>();

const itemActionName = 'item' as const;

export const itemBundle = createBundleWithClear(itemActionName, actionNamespace)<{ item: string }>();

export const bundles = [
  loadUsersWithCustomTimestampBundle,
  loadUsersWithDefaultTimestampBundle,
  loadUsersWithNoTimestampBundle,
  itemBundle,
];
