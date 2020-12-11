import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Connect } from 'ngrx-action-bundles';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { loadUsers } from './actions';

@Injectable()
export class UserListEffects {

  actions = this.connect.connectActionBundles([loadUsers]);

  loadUsers = createEffect(() => this.actions.listen.loadUsers$.pipe(switchMap(
    () => this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
      takeUntil(this.actions$.pipe(ofType(loadUsers.loadUsersCancel))),
      map(users => loadUsers.loadUsersSuccess({ users })),
      catchError(error => [loadUsers.loadUsersFailure({ error })])
    )
  )));

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private connect: Connect
  ) { }
}
