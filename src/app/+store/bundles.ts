import { createAsyncBundleWithClear, createAsyncTimestampBundleWithClear, createBundleWithClear } from 'ngrx-action-bundles';
import { IHttpRequestWithCustomTimestampError, IHttpRequestWithDefaultTimestampError, IHttpRequestWithNoTimestampError, ILoadUsersSuccessWithCustomTimestampPayload, ILoadUsersSuccessWithDefaultTimestampPayload, ILoadUsersSuccessWithNoTimestampPayload } from '../interfaces';

const actionNamespace = '[MAIN]';

const loadUsersWithCustomTimestampActionName = 'loadUsersWithCustomTimestamp' as const;
const loadUsersWithDefaultTimestampActionName = 'loadUsersWithDefaultTimestamp' as const;
const loadUsersWithNoTimestampActionName = 'loadUsersWithNoTimestamp' as const;

export const loadUsersWithCustomTimestampBundle = createAsyncTimestampBundleWithClear(loadUsersWithCustomTimestampActionName, actionNamespace)<{ timestamp: string }, ILoadUsersSuccessWithCustomTimestampPayload, IHttpRequestWithCustomTimestampError>();

export const loadUsersWithDefaultTimestampBundle = createAsyncTimestampBundleWithClear(loadUsersWithDefaultTimestampActionName, actionNamespace)<void, ILoadUsersSuccessWithDefaultTimestampPayload, IHttpRequestWithDefaultTimestampError>();

export const loadUsersWithNoTimestampBundle = createAsyncBundleWithClear(loadUsersWithNoTimestampActionName, actionNamespace)<void, ILoadUsersSuccessWithNoTimestampPayload, IHttpRequestWithNoTimestampError>();

const itemActionName = 'item' as const;

export const itemBundle = createBundleWithClear(itemActionName, actionNamespace)<{ item: string }>();

export const bundles = [
  loadUsersWithCustomTimestampBundle,
  loadUsersWithDefaultTimestampBundle,
  loadUsersWithNoTimestampBundle,
  itemBundle,
];
