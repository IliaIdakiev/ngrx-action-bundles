import { createAction, props } from '@ngrx/store';
import { createAsyncActionBundleWithClear } from 'ngrx-action-bundles';
import { IHttpRequestError, ILoadUsersSuccessPayload } from '../interfaces';

const actionNamespace = '[MAIN]';

const loadUsersActionName = 'loadUsers';

export const loadUsers = createAsyncActionBundleWithClear<
  typeof loadUsersActionName, typeof actionNamespace,
  void,
  ILoadUsersSuccessPayload,
  IHttpRequestError,
  void,
  void
>(loadUsersActionName, actionNamespace);

export const setItem = createAction(`${actionNamespace} setItem`, props<{ item: any }>());
export const clearItem = createAction(`${actionNamespace} clearItem`);
