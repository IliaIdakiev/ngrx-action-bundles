# NGRX Action Bundles (Dependencies: @ngrx/store, @ngrx/effects)

**Easily Generate NGRX Action Bundles and Easily Connect the Dispatchers and Listeners to your Angular Injectables/Components/Directives/Pipes**

TODO:

- Create connect service method type guards.
- Allow connect service methods to work with the default ngrx/store action creator

## USAGE:

`npm install ngrx-action-bundles` || `yarn add ngrx-action-bundles`

### Example:

app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { NgrxActionBundlesModule } from 'ngrx-action-bundles';
import { reducers } from './+store/reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    EffectsModule.forRoot([...]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument()
  ],
  ...
})
export class AppModule { }

```

actions.ts

```typescript
import {
  createAsyncBundleWithClear,
  createBundleWithClear,
} from "ngrx-action-bundles";
import { IHttpRequestError, ILoadUsersSuccessPayload } from "../interfaces";

const actionNamespace = "[MAIN]" as const;

const loadUsersActionName = "loadUsers" as const;
const itemActionName = "item" as const;

/* *
 *  <NGRX Action Bundles> Available functions:
 *
 *  - createBundle<NameType, NamespaceType>(actionName, namespace)<ActionPayloadType>()
 *
 *    Creates <actionName> action      --> { type: <[namespace] <actionName>>, payload: ActionPayloadType };
 *
 *    Returns: {
 *      dispatch: {
 *        [<actionName>]: (payload: ActionPayloadType) => void
 *      },
 *      listen: {
 *        [<actionName>$]: Observable<{ type: <[namespace] <actionName>>, payload: ActionPayloadType }>
 *      },
 *      creators: {
 *        [<actionName>]: (payload: ActionPayloadType) => { type: <[namespace] <actionName>>, payload: ActionPayloadType }
 *      }
 *    }
 *
 *  - createBundleWithClear<NameType, NamespaceType)<ActionPayloadType, ClearActionPayloadType>(actionName, namespace>()
 *
 *    Creates set<ActionName> action      --> { type: <[namespace] set<ActionName>>, payload: ActionPayloadType };
 *    Creates clear<ActionName> action    --> { type: <[namespace] clear<ActionName>>, payload: ClearActionPayloadType };
 *
 *    Returns: {
 *      dispatch: {
 *        [set<ActionName>]: (payload: ActionPayloadType) => void,
 *        [clera<ActionName>]: (payload: ClearActionPayloadType) => void
 *      },
 *      listen: {
 *        [set<ActionName>$]: Observable<{ type: <[namespace] set<ActionName>>, payload: ActionPayloadType }>,
 *        [clear<ActionName>$]: Observable<{ type: <[namespace] clear<ActionName>>, payload: ClearActionPayloadType }>,
 *      },
 *      creators: {
 *        [set<ActionName>]: (payload: ActionPayloadType) => { type: <[namespace] set<ActionName>>, payload: ActionPayloadType },
 *        [clear<AtionName>]: (payload: ClearActionPayloadType) => { type: <[namespace] clear<ActionName>>, payload: ClearActionPayloadType },
 *      }
 *    }
 *
 *  - createAsyncBundle<NameType, NamespaceType>(actionName, namespace)<
 *      ActionPayloadType,
 *      ActionSuccessPayloadType,
 *      ActionFailurePayloadType
 *      ActionCancelPayloadType
 *    >()
 *
 *    Creates <actionName>             --> { type: <[namespace] <actionName>>, payload: ActionPayloadType };
 *    Creates <actionName>Success      --> { type: <[namespace] <actionName>Success>, payload: ActionSuccessPayloadType };
 *    Creates <actionName>Failure      --> { type: <[namespace] <actionName>Failure>, payload: ActionFailurePayloadType }
 *    Creates <actionName>Cancel       --> { type: <[namespace] <actionName>Cancel>, payload: ActionCancelPayloadType }
 *
 *    Returns: {
 *      dispatch: {
 *        [<actionName>]: (payload: ActionPayloadType) => void,
 *        [<actionName>Success]: (payload: ActionSuccessPayloadType) => void,
 *        [<actionName>Failure]: (payload: ActionFailurePayloadType) => void,
 *        [<actionName>Cancel]: (payload: ActionCancelPayloadType) => void,
 *      },
 *      listen: {
 *        [<actionName>$]: Observable<{ type: <[namespace] <actionName>>, payload: ActionPayloadType }>,
 *        [<actionName>Success$]: Observable<{ type: <[namespace] <actionName>Success>, payload: ActionSuccessPayloadType }>,
 *        [<actionName>Failure$]: Observable<{ type: <[namespace] <actionName>Failure>, payload: ActionFailurePayloadType }>,
 *        [<actionName>Cancel$]: Observable<{ type: <[namespace] <actionName>Cancel>, payload: ActionCancelPayloadType }>,
 *      },
 *      creators: {
 *        [<actionName>]: (payload: ActionPayloadType) => { type: <[namespace] <actionName>>, payload: ActionPayloadType },
 *        [<actionName>Success]: (payload: ActionSuccessPayloadType) => { type: <[namespace] <actionName>Success>, payload: ActionSuccessPayloadType },
 *        [<actionName>Failure]: (payload: ActionFailurePayloadType) => { type: <[namespace] <actionName>Failure>, payload: ActionFailurePayloadType },
 *        [<actionName>Cancel]: (payload: ActionCancelPayloadType) => { type: <[namespace] <actionName>Cancel>, payload: ActionCancelPayloadType },
 *      }
 *    }
 *
 *  - createAsyncBundleWithClear<NameType, NamespaceType>(actionName, namespace)<
 *      ActionPayloadType, ActionSuccessPayloadType,
 *      ActionFailurePayloadType, ActionCancelPayloadType,
 *      ClearActionPayloadType>()
 *
 *    Creates <actionName>             --> { type: <[namespace] <actionName>>, payload: ActionPayloadType };
 *    Creates <actionName>Success      --> { type: <[namespace] <actionName>Success>, payload: ActionSuccessPayloadType };
 *    Creates <actionName>Failure      --> { type: <[namespace] <actionName>Failure>, payload: ActionFailurePayloadType }
 *    Creates <actionName>Cancel       --> { type: <[namespace] <actionName>Cancel>, payload: ActionCancelPayloadType }
 *    Creates <actionName>Clear        --> { type: <[namespace] <actionName>Clear>, payload: ClearActionPayloadType };
 *
 *    Returns: {
 *      dispatch: {
 *        [<actionName>]: (payload: ActionPayloadType) => void,
 *        [<actionName>Success]: (payload: ActionSuccessPayloadType) => void,
 *        [<actionName>Failure]: (payload: ActionFailurePayloadType) => void,
 *        [<actionName>Cancel]: (payload: ActionCancelPayloadType) => void,
 *        [<actionName>Clear]: (payload: ClearActionPayloadType) => void
 *      },
 *      listen: {
 *        [<actionName>$]: Observable<{ type: <[namespace] <actionName>>, payload: ActionPayloadType }>,
 *        [<actionName>Success$]: Observable<{ type: <[namespace] <actionName>Success>, payload: ActionSuccessPayloadType }>,
 *        [<actionName>Failure$]: Observable<{ type: <[namespace] <actionName>Failure>, payload: ActionFailurePayloadType }>,
 *        [<actionName>Cancel$]: Observable<{ type: <[namespace] <actionName>Cancel>, payload: ActionCancelPayloadType }>,
 *        [<actionName>Clear$]: Observable<{ type: <[namespace] <actionName>Clear>, payload: ClearActionPayloadType }>,
 *      },
 *      creators: {
 *        [<actionName>]: (payload: ActionPayloadType) => { type: <[namespace] <actionName>>, payload: ActionPayloadType },
 *        [<actionName>Success]: (payload: ActionSuccessPayloadType) => { type: <[namespace] <actionName>Success>, payload: ActionSuccessPayloadType },
 *        [<actionName>Failure]: (payload: ActionFailurePayloadType) => { type: <[namespace] <actionName>Failure>, payload: ActionFailurePayloadType },
 *        [<actionName>Cancel]: (payload: ActionCancelPayloadType) => { type: <[namespace] <actionName>Cancel>, payload: ActionCancelPayloadType },
 *        [<actionName>Clear]: (payload: ClearActionPayloadType) => { type: <[namespace] <actionName>Clear>, payload: ClearActionPayloadType },
 *      }
 *    }
 * */

export const loadUsersBundle = createAsyncBundleWithClear(
  loadUsersActionName,
  actionNamespace
)<void, ILoadUsersSuccessPayload, IHttpRequestError, void, void>();

export const itemBundle = createBundleWithClear(
  setItemActionName,
  actionNamespace
)();
```

reducers.ts

```typescript
import { createReducer, on } from "@ngrx/store";
import { loadUsersBundle, itemBundle } from "./actions";
import { IUser } from "../interfaces";

export interface IUserListState {
  userList: IUser[] | null;
  item: any;
}

export const initialState: IUserListState = {
  userList: null,
  item: null,
};

/* *
 * Here we just use the loadUsers action bundle that we've created in the actions.ts file
 * in order to access the different actions so we can provide them to the NGRX `on` function.
 * */

export const userListReducer = createReducer<IUserListState>(
  initialState,
  on(loadUsersBundle.creators.loadUsers, (state) => {
    return { ...state, userList: null };
  }),
  // since loadUsersSuccess is generated from the bundle we have a payload which contains our data
  on(
    loadUsersBundle.creators.loadUsersSuccess,
    (state, { payload: { users } }) => {
      return { ...state, userList: users };
    }
  ),
  on(
    loadUsersBundle.creators.loadUsersFailure,
    (
      status,
      {
        payload: {
          error: { message },
        },
      }
    ) => {
      return { ...status, error: message };
    }
  ),
  on(loadUsersBundle.creators.loadUsersClear, (status) => {
    return { ...status, userList: null };
  }),
  on(itemBundle.creators.setItem, (state, { payload: { item } }) => {
    return { ...state, item };
  }),
  on(itemBundle.creators.clearItem, (state) => {
    return { ...state, item: null };
  })
);
```

effects.ts

```typescript
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { IUser } from "../interfaces";
import { loadUsers } from "./actions";

@Injectable()
export class UserListEffects {
  /* *
   * Here we use the <NGRX Action Bundles> `connect` service in order to connect
   * our bundles to a property called actions on our injectable.
   *
   * */

  actions = this.connect.connectBundles([loadUsersBundle]);

  loadUsers = createEffect(() =>
    this.actions.listen.loadUsers$.pipe(
      switchMap(() =>
        this.http
          .get<IUser[]>("https://jsonplaceholder.typicode.com/users")
          .pipe(
            takeUntil(this.actions.listen.loadUsersCancel$),
            map((users) => this.actions.creators.loadUsersSuccess({ users })),
            catchError((error) => [
              this.actions.creators.loadUsersFailure({ error }),
            ])
          )
      )
    )
  );

  constructor(private http: HttpClient, private connect: Connect) {}
}
```

selectors.ts

```typescript
import { createSelector } from "@ngrx/store";
import { ActionReducerMap } from "@ngrx/store";

export interface IRootState {
  readonly main: IMainState;
}

export const reducers: ActionReducerMap<IRootState> = {
  main: mainReducer,
};

export const selectMain = (state: IRootState) => state.main;

export const selectMainUserList = createSelector(
  selectMain,
  (state: IMainState) => state.userList
);

export const selectMainItem = createSelector(
  selectMain,
  (state: IMainState) => state.item
);
```

some.component.ts

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Connect } from 'ngrx-action-bundles';
import { loadUsersBundle, itemBundle } from '../+store/actions';
import { selectMainUserList, selectMainItem } from '../+store/selectors';
import { merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  ...
})
export class SomeComponent implements OnInit, OnDestroy {

  /* *
   * Here we use the <NGRX Action Bundles> `connect` service in order to connect
   * the bundles to a property called actions on our component.
   *
   * We also use `connectSelectors` to connect all the selectors to the selectors property so we can
   * directly access the rxjs streams from the store.
   * */

  subscriptions = new Subscription();

  actions = this.connect.connectBundles([
    loadUsersBundle,
    itemBundle
  ]);

  selectors = this.connect.connectSelectors({
    userList: selectMainUserList,
    item: selectMainItem
  });

  users$ = this.selectors.userList$;
  item$ = this.selectors.item$;

  isLoading = false;

  constructor(private connect: Connect) {
    this.subscriptions.add(
      merge<any, boolean>(
        this.actions.listen.loadUsers$.pipe(mapTo(true)),
        this.actions.listen.loadUsersSuccess$.pipe(mapTo(false)),
        this.actions.listen.loadUsersFailure$.pipe(mapTo(false)),
      ).subscribe(isLoading => this.isLoading = isLoading)
    );
  }

  ngOnInit(): void {
    this.actions.dispatch.loadUsers();

    this.subscriptions.add(
      this.actions.listen.loadUsersSuccess$.subscribe(console.log)
    );
    this.subscriptions.add(
      this.actions.listen.loadUsersCancel$.subscribe(console.log)
    );
    this.subscriptions.add(
      this.actions.listen.loadUsersClear$.subscribe(console.log)
    );
  }


  ngOnDestroy(): void {
    if (this.isLoading) { this.actions.dispatch.loadUsersCancel(); }
    this.actions.dispatch.loadUsersClear();
    this.subscriptions.unsubscribe();
  }
}

```

some.component.html

```html
<div>
  <h1>User List</h1>
  <div *ngIf="isLoading">Loading...</div>
  <div *ngFor="let user of (users$ | async)">{{user.username}}</div>
  <button (click)="actions.dispatch.loadUsers()">Reload Users</button>
</div>
<div>
  <h1>Message Item is: {{item$ | async}}</h1>
  <input #inp type="text" value="" />
  <button
    (click)="actions.dispatch.setItem({ item: inp.value }); inp.value = ''"
  >
    Set item in store
  </button>
  <button (click)="actions.dispatch.clearItem()">Clear item in store</button>
</div>
```
