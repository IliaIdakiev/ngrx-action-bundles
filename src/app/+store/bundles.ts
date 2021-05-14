import { createAsyncBundleWithClear, createBundleWithClear } from 'ngrx-action-bundles';
import { IHttpRequestError, ILoadUsersSuccessPayload } from '../interfaces';

const actionNamespace = '[MAIN]';

const loadUsersActionName = 'loadUsers' as const;

export const loadUsersBundle = createAsyncBundleWithClear(loadUsersActionName, actionNamespace)<void, ILoadUsersSuccessPayload, IHttpRequestError>();

const itemActionName = 'item' as const;

export const itemBundle = createBundleWithClear(itemActionName, actionNamespace)<{ item: string }>();
