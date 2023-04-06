import { inject } from "@angular/core";
import { createSelector } from "@ngrx/store";
import { Connect } from "./connect.service";
import { BundleFactoryResultValues } from "./types";

export function connectBundles<T extends ReadonlyArray<BundleFactoryResultValues<U>>, U extends string>(bundles: T) {
  const connect = inject(Connect);
  return connect.bundles(bundles);
}

export function connectSelectors<T extends { [key: string]: ReturnType<typeof createSelector<any, any, any>> }>(selectors: T) {
  const connect = inject(Connect);
  return connect.selectors(selectors);
}

