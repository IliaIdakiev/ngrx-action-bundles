const actionTypeCache: { [actionType: string]: boolean } = {};

export function actionType<T extends string>(actionTypeName: T): T {
  if (actionTypeCache[actionTypeName]) {
    throw new Error(`Action type name: ${actionTypeName} is already registered!`);
  }
  actionTypeCache[actionTypeName] = true;
  return actionTypeName;
}
