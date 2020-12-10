type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type ElementOf<T> = T extends (infer E)[] ? E : T;
