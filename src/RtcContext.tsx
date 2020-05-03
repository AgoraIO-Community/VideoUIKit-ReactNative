import React, {Dispatch} from 'react';
import {CallbacksInterface} from './PropsContext';
import RtcEngine from 'react-native-agora';

export interface UidInterface {
  // TODO: refactor local to 0 and remove string.
  uid: number | string;
  audio: boolean;
  video: boolean;
}

export interface UidStateInterface {
  min: Array<UidInterface>;
  max: Array<UidInterface>;
}

export interface ActionInterface<
  T extends keyof CallbacksInterface,
  K extends CallbacksInterface
> {
  type: T;
  value: Parameters<K[T]>;
}

export type DispatchType<T extends keyof CallbacksInterface> = Dispatch<
  ActionInterface<T, CallbacksInterface>
>;

export type ActionType<T extends keyof CallbacksInterface> = ActionInterface<
  T,
  CallbacksInterface
>;

export interface RtcContextInterface {
  RtcEngine: RtcEngine;
  dispatch: DispatchType<keyof CallbacksInterface>;
}

const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface,
);

export const RtcProvider = RtcContext.Provider;
export const RtcConsumer = RtcContext.Consumer;
export default RtcContext;
