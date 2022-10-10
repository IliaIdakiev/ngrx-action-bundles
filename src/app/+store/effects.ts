import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { IUser } from '../interfaces';
import { Model } from './model';

@Injectable()
export class UserListEffects {

  loadUsersWithCustomTimestamp = createEffect(() => this.model.actions.listen.loadUsersWithCustomTimestamp$.pipe(switchMap(
    ({ payload: { timestamp } }) => this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
      takeUntil(this.model.actions.listen.loadUsersWithCustomTimestamp$.pipe(filter(({ payload }) => payload.timestamp === timestamp))),
      map(users => this.model.actions.creators.loadUsersWithCustomTimestampSuccess({ users, timestamp })),
      catchError(error => [this.model.actions.creators.loadUsersWithCustomTimestampFailure({ error, timestamp })])
    )
  )));

  loadUsersWithDefaultTimestamp = createEffect(() => this.model.actions.listen.loadUsersWithDefaultTimestamp$.pipe(switchMap(
    ({ payload: { timestamp } }) => this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
      takeUntil(this.model.actions.listen.loadUsersWithDefaultTimestamp$.pipe(filter(({ payload }) => payload.timestamp === timestamp))),
      map(users => this.model.actions.creators.loadUsersWithDefaultTimestampSuccess({ users, timestamp })),
      catchError(error => [this.model.actions.creators.loadUsersWithDefaultTimestampFailure({ error, timestamp })])
    )
  )));

  loadUsersWithNoTimestamp = createEffect(() => this.model.actions.listen.loadUsersWithNoTimestamp$.pipe(switchMap(
    () => this.http.get<IUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
      takeUntil(this.model.actions.listen.loadUsersWithNoTimestamp$),
      map(users => this.model.actions.creators.loadUsersWithNoTimestampSuccess({ users })),
      catchError(error => [this.model.actions.creators.loadUsersWithNoTimestampFailure({ error })])
    )
  )));

  constructor(
    private http: HttpClient,
    private model: Model
  ) { }
}
