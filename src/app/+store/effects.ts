import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { loadUsers } from './actions';

@Injectable()
export class UserListEffects {
  loadUsers = createEffect(() => this.actions$.pipe(
    ofType(loadUsers.loadUsers),
    switchMap(
      () => this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
        takeUntil(this.actions$.pipe(ofType(loadUsers.loadUsersCancel))),
        map(users => loadUsers.loadUsersSuccess({ users }))
      )
    )
  ));

  constructor(private actions$: Actions, private http: HttpClient) { }
}
