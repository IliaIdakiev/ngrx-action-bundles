import { UnionToIntersection, ElementOf } from '../types';

export function deepAssign<R extends any[]>(...sources: R): UnionToIntersection<ElementOf<R>> {
  const [first, ...others] = sources;
  const target = first || {};
  const targetDescriptors = Object.getOwnPropertyDescriptors(target);
  for (const source of others) {
    const descriptors = Object.getOwnPropertyDescriptors(source);
    const sourceDescriptorEntries = Object.entries(descriptors);
    for (const [descKey, descValue] of sourceDescriptorEntries) {
      const targetValueIsNull = targetDescriptors[descKey]?.value === null;
      const sourceValueIsNull = descValue?.value === null;
      if (
        typeof targetDescriptors[descKey]?.value === 'object' && typeof descValue?.value === 'object' &&
        !targetValueIsNull && !sourceValueIsNull
      ) {
        deepAssign(targetDescriptors[descKey].value, descValue.value);
      } else {
        Object.defineProperty(target, descKey, descValue);
      }
    }
  }
  return target;
}
