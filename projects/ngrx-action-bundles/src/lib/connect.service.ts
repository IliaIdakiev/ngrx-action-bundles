import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { createSelector, Store } from '@ngrx/store'
import { BundleFactoryResultValues, ElementOf, SelectorStreams, ListenStreams, UnionToIntersection } from "./types";

@Injectable({
  providedIn: 'root'
})
export class Connect {

  constructor(private store: Store, private actions: Actions) { }

  bundles<T extends ReadonlyArray<BundleFactoryResultValues<U>>, U extends string>(bundles: T) {

    const result = { create: {} as any, dispatch: {} as any, listen: {} as any };
    for (const creators of bundles) {
      for (const [key, creator] of Object.entries(creators)) {
        result.create[key] = (...args: any[]) => {
          const action = (creator as any)(...args);
          return action;
        };
        result.dispatch[key] = (...args: any[]) => {
          const action = (creator as any)(...args);
          this.store.dispatch(action);
          return action;
        };
        result.listen[`${key}$`] = this.actions.pipe(ofType((creator as any).type));
      }
    }

    return result as unknown as T extends ReadonlyArray<BundleFactoryResultValues<U>> ? {
      create: UnionToIntersection<ElementOf<{ -readonly [P in keyof T]: T[P] }>>,
      dispatch: UnionToIntersection<ElementOf<{ -readonly [P in keyof T]: T[P] }>>,
      listen: ListenStreams<UnionToIntersection<ElementOf<{ -readonly [P in keyof T]: T[P] }>>>
    } : never;
  }

  selectors<T extends { [key: string]: ReturnType<typeof createSelector<any, any, any>> }>(selectors: T) {
    const result: any = {};
    for (const [key, selector] of Object.entries(selectors)) {
      result[`${key}$`] = this.store.select(selector);
    }
    return result as unknown as SelectorStreams<T>;
  }
}
