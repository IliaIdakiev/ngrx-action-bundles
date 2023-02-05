# NGRX Action Bundles (Depends on: @ngrx/store, @ngrx/effects)

**This library allows you to reduce ngrx boilerplate by generating action bundles for common ngrx redux store scenarios and allows you to easily connect state, dispatch actions and listen for actions everywhere across your applications**

## Installation:

1. Install ngrx dependencies - `npm install @ngrx/store @ngrx/effects` or `yarn add @ngrx/store @ngrx/effects`.
2. Install the library - `npm install ngrx-action-bundles` || `yarn add ngrx-action-bundles`

### Usage:

1. **Setup your ngrx store.**

    ```typescript
    // app.module.ts
    import { NgModule } from '@angular/core';
    import { reducers } from './+store/reducers';
    import { StoreModule } from '@ngrx/store';
    import { EffectsModule } from '@ngrx/effects';
    import { StoreDevtoolsModule } from '@ngrx/store-devtools';

    @NgModule({
      imports: [
        ...
        EffectsModule.forRoot([...]),
        StoreModule.forRoot(reducers),
        StoreDevtoolsModule.instrument()
      ],
      ...
    })
    export class AppModule { }

    ```
2. **Create some actions.**

    ```typescript
    // bundles.ts
    const factory = forNamespace('MAIN'); // create namespaced action factory. All action types will be
    // with the format `[MAIN] ${actionName}`.

    // Here we are going to be doing an async operation we have multiple thing we want to handle:
    // 1. send request to the server.
    // 2. if the request succeeds we need to do something with the response.
    // 3. if the request fails we need to do something with the error.
    // 4. if the request is not needed any more we want to cancel it
    // In this case we will use the factory.asyncAction creator to create all those actions for us.
    export const loadUsers = factory.asyncAction(
      'loadUsers', // action name
      undefined, // request action payload interface (the action type will be `[MAIN] loadUsers`)
      props<{ users: IUser[] }>(), // success action payload interface (the action type will be `[MAIN] loadUsersSuccess`)
      props<{ error: any }>(), // failure action payload interface (the action type will be `[MAIN] loadUsersFailure`)
      undefined // cancel action payload interface (the action type will be `[MAIN] loadUsersCancel`)
      //, true/false - there is one additional optional argument that can be provided here which will allow us to  have a unique timestamp for the request action to be able to distinguish different requests which is sometimes required whenever we are doing async operations. For more info look at the bottom of the page.
    );
    
    // loadUsers will look like { 
    //   loadUsers: loadUsersActionCreator,
    //   loadUsersSuccess: loadUsersSuccessActionCreator,
    //   loadUsersFailure: loadUsersFailureActionCreator,
    //   loadUsersCancel: loadUsersCancelActionCreator
    // }

    // Next we are going to be setting something inside the store but at the same time we will need a clean-up action so
    // we will use the singleActionWithCleanup. This will generate the "setItem" and "SetItemCleanup" actions;
    export const setItem = factory.singleActionWithCleanup(
      'setItem',
      props<{ item: string }>()
    );
    
    // setItem will look like { 
    //   setItem: loadUsersActionCreator,
    //   setItemCleanup: setItemCleanupActionCreator
    // }


    // At the end we will create this ReadonlyArray that will store all of our action bundles that we will be using inside our app
    // Later on we will use this array to connect those bundles to our components/services/pipes/directives. In this example
    // we will just connect it to the main component.
    export const bundles = [loadUsers, setItem] as const;
    ```

3. **Setup the reducer**
    ```typescript
    // reducers.ts
    import { createReducer, on } from '@ngrx/store';
    import { loadUsers, setItem } from './bundles';
    import { IUser } from '../interfaces';

    export interface IMainState {
      userList: IUser[] | null;
      error: string | null;
      item: any;
    }

    export const initialState: IMainState = {
      userList: null,
      error: null,
      item: null
    };

    export const mainReducer = createReducer<IMainState>(
      initialState,
      on(
        loadUsers.loadUsers,
        (state: IMainState) => ({ ...state, userList: null })
      ),
      on(
        loadUsers.loadUsersSuccess,
        (state, { users }) => {
          return { ...state, userList: users }
        }
      ),
      on(
        loadUsers.loadUsersFailure,
        (state, { error }) => {
          return { ...state, error };
        }
      ),
      on(
        setItem.setItem,
        (state, { item }) => {
          return { ...state, item };
        }
      ),
      on(
        setItem.setItemCleanup,
        (state) => ({ ...state, item: null })
      )
    );    
    ```
4. **Setup our effects where we will be sending requests to the server and other dirty stuff**

    ```typescript
    // effects.ts
    import { HttpClient } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { createEffect } from '@ngrx/effects';
    import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
    import { IUser } from '../interfaces';
    import { Connect } from 'ngrx-action-bundles';

    @Injectable()
    export class Effects {
      
      // Let's connect the bundles array that we've created earlier with the 
      // connect service from the ngrx-action-bundles
      actions = this.connect.bundles(bundles);
      // actions will look like { 
      //   create: { [availableActions]: actionCreatros } 
      //   dispatch: { [availableActions]: actionDispatchers (the dispatcher will dispatch the action and return the action that we've dispatched as well) } 
      //   listen: { [availableActions$]: actionStreams (rxjs action streams) } 
      // }

      // Here we want to listen for loadUsers action dispatch a request to the server
      // if we receive loadUsersCancel action will will cancel the request
      // if the request succeeds we will send loadUsersSuccess action
      // if the request fails we will send loadUsersFailure action
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
      ;
      constructor(
        private http: HttpClient,
        private connect: Connect
      ) { }
    }

    ```
5. **Create our ngrx redux store selectors**

    ```typescript
    // selectors.ts
    import { createSelector } from '@ngrx/store';
    import { IRootState } from './index';
    import { IMainState } from './reducers';

    const selectMain = (state: IRootState) => state.main;

    export const userList = createSelector(
      selectMain,
      (state: IMainState) => state.userList
    );

    export const item = createSelector(
      selectMain,
      (state: IMainState) => state.item
    );
    ```

6. **Let's start using everything**

    ```typescript
    //some.component.ts
    import { Component, OnDestroy, OnInit } from '@angular/core';
    import { Connect } from 'ngrx-action-bundles';
    import { loadUsersBundle, itemBundle } from '../+store/actions';
    import { selectMainUserList, selectMainItem } from '../+store/selectors';
    import { merge, Subscription, map } from 'rxjs';

    @Component({
      ...
    })
    export class SomeComponent implements OnInit, OnDestroy {
      subscriptions = new Subscription();
      isLoading = false;

      // Let's connect the bundles array that we've created earlier
      actions = this.connect.bundles(bundles);
      // actions will look like { 
      //   create: { [availableActions]: actionCreatros } 
      //   dispatch: { [availableActions]: actionDispatchers (the dispatcher will dispatch the action and return the action that we've dispatched as well) } 
      //   listen: { [availableActions$]: actionStreams (rxjs action streams) } 
      // }
      
      // Let's also connect all the selectors that we've created.
      selectors = this.connect.selectors(selectors);
      // selectors will look like { 
      //   [availableActions$]: selectorStreams (rxjs selector streams)
      // }
      
      // In order to connect all of those we will use the ngrx action bundles connect service
      constructor(private connect: Connect) { 
        
        // Let's react over the loading of the users. 
        // Every time a loadUsers action is dispatched we will set isLoading to true
        // and when we get a success or failure action we will set isLoading to false
        this.subscriptions.add(
          merge(
            this.actions.listen.loadUsers$.pipe(map(() => true)),
            this.actions.listen.loadUsersSuccess$.pipe(map(() => false)),
            this.actions.listen.loadUsersFailure$.pipe(map(() => false)),
          ).subscribe(isLoading => this.isLoading = isLoading)
        );
      }
      
      ngOnInit(): void { this.loadUsers(); }
      
      // Let's create a method that we will use to dispatch the load users action
      // here we will just use the dispatch property of the actions to dispatch the
      // load users action that we've created earlier
      loadUsers() { this.actions.dispatch.loadUsers(); }
      
      setItem(input: HTMLInputElement) {
        actions.dispatch.setItem({ item: input.value }); 
        input.value = '';
      }
      
      clearItem() { this.actions.dispatch.clearItem(); }


      ngOnDestroy(): void {
        // if the component is going to be destroyed and we are still in loading state
        if (this.isLoading) { this.actions.dispatch.loadUsersCancel(); }
        this.actions.dispatch.loadUsersClear();
        this.subscriptions.unsubscribe();
      }
    }

    ```

    ```html
    <!-- some.component.html -->
    <div>
      <h1>User List</h1>
      <div *ngIf="isLoading">Loading...</div>
      <div *ngFor="let user of (selectors.users$ | async)">{{user.username}}</div>
      <button (click)="loadUsers()">Reload Users</button>
    </div>
    <div>
      <h1>Message Item is: {{selectors.item$ | async}}</h1>
      <input #input type="text" value="" />
      <button (click)="setItem(input)"> 
        Set item in store
      </button>
      <button (click)="clearItem()">Clear item in store</button>
    </div>
    ```
---
## Unique Action Id - Timestamp

If you need a unique way to distinguish actions you can take a look into the `asyncAction` last argument. If set to `true` you will notice that we have something a timestamp inside the payload which will look like `1647882544485.2952`. The `1647882544485` part is the datetime and the `.2952` is a random number added so we can distinguish actions that are dispatched one after another in the same stack frame.