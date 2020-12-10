import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { deepAssign } from './utils';

class EmptyActionBundle {
  listen = {};
  dispatch = {};
  constructor(private $internal: { dispatch: any, actions$: any }) { }
}

@Injectable()
export class NgrxActionBundlesService<S = object, A = Action> {

  constructor(
    private store: Store<S>,
    private actions$: Actions<A>
  ) { }

  connectSelectors<T extends object>(selectors: T): any {
    const entries = Object.entries(selectors);
    const connect: any = {};
    for (const [key, value] of entries) {
      connect[`${key}$`] = this.store.select(value);
    }
    return connect;
  }

  connectActionBundles<T>(bundle: T[]): UnionToIntersection<T | EmptyActionBundle> {
    const $internal = {
      dispatch: this.store.dispatch.bind(this.store),
      actions$: this.actions$
    };
    return deepAssign(new EmptyActionBundle($internal), ...bundle);
  }
}
