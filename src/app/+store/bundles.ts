import { createAsyncBundleWithClear, createBundleWithClear } from 'ngrx-action-bundles';
import { IHttpRequestError, ILoadUsersSuccessPayload } from '../interfaces';

const actionNamespace = '[MAIN]';

const loadUsersActionName = 'loadUsers' as const;

export const loadUsersBundle = createAsyncBundleWithClear<
  typeof loadUsersActionName, typeof actionNamespace,
  void,
  ILoadUsersSuccessPayload,
  IHttpRequestError,
  void,
  void
>(loadUsersActionName, actionNamespace);

const itemActionName = 'item' as const;

export const itemBundle = createBundleWithClear<
  typeof itemActionName,
  typeof actionNamespace,
  { item: string }
>(itemActionName, actionNamespace);
