
export function deepAssign<R extends any[]>(...sources: R): UnionToIntersection<ElementOf<R>> {
  const [first, ...others] = sources;
  const target = first || {};
  for (const source of others) {
    const sourceEntries = Object.entries(source);
    for (const [sourceKey, sourceValue] of sourceEntries) {
      const targetValueIsNull = target[sourceKey] === null;
      const sourceValueIsNull = sourceValue === null;
      if (
        typeof target[sourceKey] === 'object' && typeof sourceValue === 'object' &&
        !targetValueIsNull && !sourceValueIsNull
      ) {
        deepAssign(target[sourceKey], sourceValue);
      } else {
        target[sourceKey] = sourceValue;
      }
    }
  }
  return target as UnionToIntersection<ElementOf<R>>;
}

function capitalize<T extends string>(s: T): Capitalize<T> {
  if (typeof s !== 'string') { return '' as Capitalize<T>; }
  return s.charAt(0).toUpperCase() + s.slice(1) as Capitalize<T>;
}
