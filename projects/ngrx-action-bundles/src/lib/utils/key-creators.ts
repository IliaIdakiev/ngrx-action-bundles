import { capitalize } from './capitalize';

export function makeActionKeyWithSuffix<AN extends string, N extends string>(actionName: AN, suffix: N): `${AN}${N}` {
  return actionName + suffix as `${AN}${N}`;
}

export function makeNamespacedActionKey<NS extends string, N extends string>(namespace: NS, name: N): `${NS} ${Capitalize<N>}` {
  return namespace + ' ' + capitalize(name) as `${NS} ${Capitalize<N>}`;
}
