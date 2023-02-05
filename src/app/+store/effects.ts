import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { Model } from './model';

@Injectable()
export class Effects {

  loadUsersWithCustomTimestamp = createEffect(() =>
    this.model.actions.listen.loadUsers$.pipe(switchMap(
      () => this.http.get<IUser[]>(
        'https://jsonplaceholder.typicode.com/users'
      ).pipe(
        takeUntil(this.model.actions.listen.loadUsersCancel$),
        map(users => this.model.actions.create.loadUsersSuccess({ users })),
        catchError(error =>
          [this.model.actions.create.loadUsersFailure({ error })]
        )
      )
    )));
  ;
  constructor(
    private http: HttpClient,
    private model: Model
  ) { }
}
