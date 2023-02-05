import { ActionCreatorProps, createAction } from '@ngrx/store';
import { createTimestamp } from './utils';
import { actionType } from './action-type';
import { createActionWithTimestamp, ElementOf, Range } from './types';

const EMPTY_SYMBOL = Symbol('EMPTY_SYMBOL');
type EMPTY = { _empty: typeof EMPTY_SYMBOL };
type ALLOWED_DEPTHS = ElementOf<Range<90>>;

function single<
  Namespace extends string,
  ActionName extends string,
  P extends object = EMPTY
>(namespace: Namespace, actionName: ActionName, _props?: ActionCreatorProps<P>) {
  const name = actionType(`[${namespace}] ${actionName}`);
  const actionFactory = createAction(name, _props as any);
  return actionFactory as unknown as P extends EMPTY ?
    ReturnType<typeof createAction<`[${Namespace}] ${ActionName}`>> :
    ReturnType<typeof createAction<`[${Namespace}] ${ActionName}`, P>>;
}

function singleWithTimestamp<
  Namespace extends string,
  ActionName extends string,
  P extends object = EMPTY
>(namespace: Namespace, actionName: ActionName, _props?: ActionCreatorProps<P>) {
  const name = actionType(`[${namespace}] ${actionName}`);
  const actionFactory = createAction(name, _props as any);
  const actionFactoryWrapper = (...args: any[]) => {
    return Object.assign((actionFactory as any)(...args), { timestamp: createTimestamp() });
  }
  (actionFactoryWrapper as any).type = actionFactory.type;

  return actionFactoryWrapper as unknown as P extends EMPTY ?
    ReturnType<typeof createActionWithTimestamp<`[${Namespace}] ${ActionName}`>> :
    ReturnType<typeof createActionWithTimestamp<`[${Namespace}] ${ActionName}`, P>>;
}

export function forNamespace<Namespace extends string>(namespace: Namespace) {

  const singleAction = <
    ActionName extends string,
    P extends object = EMPTY,
    T extends boolean = false,
  >(actionName: ActionName, _props?: ActionCreatorProps<P>, useWithTimestamp?: T):
    Record<
      ActionName,
      T extends false ?
      ReturnType<typeof single<Namespace, ActionName, P>> :
      ReturnType<typeof singleWithTimestamp<Namespace, ActionName, P>>
    > => {
    const name = actionName;
    if (useWithTimestamp === true) {
      return { [name]: singleWithTimestamp<Namespace, ActionName, P>(namespace, actionName, _props) } as any;
    }
    return { [name]: single<Namespace, ActionName, P>(namespace, actionName, _props) } as any;
  };


  const singleActionWithCleanup = <
    ActionName extends string,
    P extends object = EMPTY,
    PC extends object = EMPTY,
    T extends boolean = false,
  >(actionName: ActionName, _props?: ActionCreatorProps<P>, _props_cleanup?: ActionCreatorProps<PC>, useWithTimestamp?: T) => {
    const requestActionName: ActionName = actionName;
    const cleanupActionName: `${ActionName}Cleanup` = `${actionName}Cleanup`;
    const requestCreators = singleAction(requestActionName, _props, useWithTimestamp);
    const cleanupCreators = singleAction(cleanupActionName, _props_cleanup);
    const creators = Object.assign(requestCreators, cleanupCreators);
    return creators;
  };

  const asyncAction = <
    ActionName extends string,
    P_R extends object = EMPTY,
    P_S extends object = EMPTY,
    P_F extends object = EMPTY,
    P_C extends object = EMPTY,
    T extends boolean = false,
  >(
    actionName: ActionName,
    _props_request?: ActionCreatorProps<P_R>,
    _props_success?: ActionCreatorProps<P_S>,
    _props_failure?: ActionCreatorProps<P_F>,
    _props_cancel?: ActionCreatorProps<P_C>,
    useWithTimestamp?: T
  ) => {

    const requestActionName: ActionName = actionName;
    const successActionName: `${ActionName}Success` = `${actionName}Success`;
    const failureActionName: `${ActionName}Failure` = `${actionName}Failure`;
    const cancelActionName: `${ActionName}Cancel` = `${actionName}Cancel`;

    const requestCreators = singleAction(requestActionName, _props_request, useWithTimestamp);
    const successCreators = singleAction(successActionName, _props_success);
    const failureCreators = singleAction(failureActionName, _props_failure);
    const cancelCreators = singleAction(cancelActionName, _props_cancel);

    const creators = Object.assign(requestCreators, successCreators, failureCreators, cancelCreators);
    return creators;
  };

  const asyncActionWithCleanup = <
    ActionName extends string,
    P_R extends object = EMPTY,
    P_S extends object = EMPTY,
    P_F extends object = EMPTY,
    P_C extends object = EMPTY,
    P_CL extends object = EMPTY,
    T extends boolean = false,
  >(
    actionName: ActionName,
    _props_request?: ActionCreatorProps<P_R>,
    _props_success?: ActionCreatorProps<P_S>,
    _props_failure?: ActionCreatorProps<P_F>,
    _props_cancel?: ActionCreatorProps<P_C>,
    _props_cleanup?: ActionCreatorProps<P_CL>,
    useWithTimestamp?: T
  ) => {
    const cleanupActionName: `${ActionName}Cleanup` = `${actionName}Cleanup`;
    const cleanupCreators = singleAction(cleanupActionName, _props_cleanup);
    const asyncCreators = asyncAction(actionName, _props_request, _props_success, _props_failure, _props_cancel, useWithTimestamp);
    const creators = Object.assign(asyncCreators, cleanupCreators);
    return creators;
  }

  return { singleAction, singleActionWithCleanup, asyncAction, asyncActionWithCleanup };
}
