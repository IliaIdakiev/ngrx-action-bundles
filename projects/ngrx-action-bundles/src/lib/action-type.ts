const actionTypeCache: { [actionType: string]: boolean } = {};

export function actionType<T extends string>(actionTypeName: T): T {
  if (actionTypeCache[actionTypeName]) {
    console.error(`ngrx-action-bundles: Action type name: ${actionTypeName} is already registered! Two actions with the same action type will result in unpredictable behavior.`);
  }
  actionTypeCache[actionTypeName] = true;
  return actionTypeName;
}
