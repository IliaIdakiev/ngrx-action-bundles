import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { Model } from './model';

@Injectable()
export class Effects {

  loadUsers = createEffect(() =>
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

  loadUsersWithTimestamp = createEffect(() =>
    this.model.actions.listen.loadUsersWithTimestamp$.pipe(switchMap(
      ({ timestamp }) => this.http.get<IUser[]>(
        'https://jsonplaceholder.typicode.com/users'
      ).pipe(
        takeUntil(this.model.actions.listen.loadUsersWithTimestampCancel$),
        map(users => this.model.actions.create.loadUsersWithTimestampSuccess({ users, timestamp })),
        catchError(error =>
          [this.model.actions.create.loadUsersWithTimestampFailure({ error, timestamp })]
        )
      )
    )));



  loadUsers2 = createEffect(() =>
    this.model.actions.listen.loadUsers2$.pipe(switchMap(
      () => this.http.get<IUser[]>(
        'https://jsonplaceholder.typicode.com/users'
      ).pipe(
        takeUntil(this.model.actions.listen.loadUsers2Cancel$),
        map(users => this.model.actions.create.loadUsers2Success({ users })),
        catchError(error =>
          [this.model.actions.create.loadUsers2Failure({ error })]
        )
      )
    )));

  loadUsersWithTimestamp2 = createEffect(() =>
    this.model.actions.listen.loadUsersWithTimestamp2$.pipe(switchMap(
      ({ timestamp }) => this.http.get<IUser[]>(
        'https://jsonplaceholder.typicode.com/users'
      ).pipe(
        takeUntil(this.model.actions.listen.loadUsersWithTimestamp2Cancel$),
        map(users => this.model.actions.create.loadUsersWithTimestamp2Success({ users, timestamp })),
        catchError(error =>
          [this.model.actions.create.loadUsersWithTimestamp2Failure({ error, timestamp })]
        )
      )
    )));

  constructor(
    private http: HttpClient,
    private model: Model
  ) { }
}
