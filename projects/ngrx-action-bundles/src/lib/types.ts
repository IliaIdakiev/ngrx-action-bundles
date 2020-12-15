import { FunctionWithParametersType, TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';

export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type ElementOf<T> = T extends (infer E)[] ? E : T;

// export type MapKeyToCreator<T, Key extends string> = {
//   [P in keyof T & string as `${Key}`]: T[P]
// };

export type UniqueActionCreator<T extends string, P> = (payload: P) => { payload: P } & FunctionWithParametersType<[payload: P], {
  payload: P;
}> & TypedAction<T>;

export type WithDispatchAndListenResult<T> = {
  listen: { [K in keyof T & string as `${K}$`]:
    Observable<T[K] extends (...args: any) => any ? ReturnType<T[K]> :
      T[K] extends () => any ? ReturnType<T[K]> : never>;
  };
  dispatch: {
    [K in keyof T]: T[K] extends (payload: infer P) => { payload: any } & TypedAction<any> ?
    (payload: P) => void : T[K] extends (...args: infer F) => TypedAction<any> ? (...args: F) => void :
    T[K] extends () => TypedAction<any> ? () => TypedAction<any> : never;
  };
};

export type Unpack<T> = T extends Array<infer I>
  ? I
  : T extends (...args: any) => infer R
  ? R
  : T extends Promise<infer P>
  ? P
  : T;
