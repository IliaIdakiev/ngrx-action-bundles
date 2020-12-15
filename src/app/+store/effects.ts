import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Connect } from 'ngrx-action-bundles';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { loadUsersBundle } from './bundles';

@Injectable()
export class UserListEffects {

  actions = this.connect.connectBundles([loadUsersBundle]);

  loadUsers = createEffect(() => this.actions.listen.loadUsers$.pipe(switchMap(
    () => this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
      takeUntil(this.actions.listen.loadUsersCancel$),
      map(users => this.actions.creators.loadUsersSuccess({ users })),
      catchError(error => [this.actions.creators.loadUsersFailure({ error })])
    )
  )));

  constructor(
    private http: HttpClient,
    private connect: Connect
  ) { }
}
