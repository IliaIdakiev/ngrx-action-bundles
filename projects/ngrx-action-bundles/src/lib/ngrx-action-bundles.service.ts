import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { deepAssign } from './utils';
import { Observable } from 'rxjs';


class EmptyActionBundle {
  listen = {};
  dispatch = {};
  creators = {};

  constructor($internal: { dispatch: any, actions$: any }) {
    this.listen = { $internal };
    this.dispatch = { $internal };
  }
}

@Injectable()
export class Connect<S = object, A = Action> {


  constructor(
    private store: Store<S>,
    private actions$: Actions<A>
  ) { }

  connectSelectors<T extends object>(selectors: T): {
    [K in keyof T & string as `${K}\$`]: T[K] extends (...args: any[]) => infer U ? Observable<U> : never
  } {
    const entries = Object.entries(selectors);
    const connect: any = {};
    for (const [key, value] of entries) {
      connect[`${key}$`] = this.store.select(value);
    }
    return connect as {
      [K in keyof T & string as `${K}\$`]: T[K] extends (...args: any[]) => infer U ? Observable<U> : never
    };
  }

  // tslint:disable-next-line:typedef
  connectActionBundles<T>(bundles: T[]) {

    const $internal = {
      dispatch: this.store.dispatch.bind(this.store),
      actions$: this.actions$
    };

    const empty = new EmptyActionBundle($internal) as { dispatch: {}, listen: {}, creators: {} };
    return deepAssign(empty, ...bundles);
  }
}
