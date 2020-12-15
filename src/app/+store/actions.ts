import { createAsyncBundleWithClear, createBundleWithClear } from 'ngrx-action-bundles';
import { IHttpRequestError, ILoadUsersSuccessPayload } from '../interfaces';

const actionNamespace = '[MAIN]';

const loadUsersActionName = 'loadUsers';

export const loadUsersBundle = createAsyncBundleWithClear<
  typeof loadUsersActionName, typeof actionNamespace,
  void,
  ILoadUsersSuccessPayload,
  IHttpRequestError,
  void,
  void
>(loadUsersActionName, actionNamespace);
export const loadUsers = loadUsersBundle.creators;

export const testBundle = createBundleWithClear('Test', actionNamespace);
export const test = testBundle.creators;
