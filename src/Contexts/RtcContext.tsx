import React from 'react';
import {CallbacksInterface} from './PropsContext';
import RtcEngine from 'react-native-agora';
import type {DualStreamMode, RenderInterface} from './PropsContext';

export type UidType = number;

export interface RenderObjects {
  [key: number]: RenderInterface;
}

export interface RenderStateInterface {
  renderList: RenderObjects;
  activeUids: Array<UidType>;
}

export interface ActionInterface<T extends keyof CallbacksInterface> {
  type: T;
  value: Parameters<CallbacksInterface[T]>;
}

export type DispatchType = <
  T extends keyof CallbacksInterface,
  V extends Parameters<CallbacksInterface[T]>,
>(action: {
  type: T;
  value: V;
}) => void;

export type ActionType<T extends keyof CallbacksInterface> = ActionInterface<T>;

export interface RtcContextInterface {
  RtcEngine: RtcEngine;
  dispatch: DispatchType;
  setDualStreamMode: React.Dispatch<React.SetStateAction<DualStreamMode>>;
}

const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface,
);

export const RtcProvider = RtcContext.Provider;
export const RtcConsumer = RtcContext.Consumer;
export default RtcContext;
