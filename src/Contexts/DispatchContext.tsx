import React from 'react';
import {CallbacksInterface} from './PropsContext';

export type DispatchType = <
  T extends keyof CallbacksInterface,
  V extends Parameters<CallbacksInterface[T]>,
>(action: {
  type: T;
  value: V;
}) => void;

export interface DispatchContextInterface {
  dispatch: DispatchType;
}

const DispatchContext = React.createContext<DispatchContextInterface>(
  {} as DispatchContextInterface,
);

export const DispatchProvider = DispatchContext.Provider;
export const DispatchConsumer = DispatchContext.Consumer;
export default DispatchContext;
