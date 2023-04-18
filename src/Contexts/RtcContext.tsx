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
  activeSpeaker?: UidType;
  pinnedUid?: UidType;
  lastJoinedUid?: UidType;
}

export interface ActionInterface<T extends keyof CallbacksInterface> {
  type: T;
  value: Parameters<CallbacksInterface[T]>;
}

export type ActionType<T extends keyof CallbacksInterface> = ActionInterface<T>;

export interface RtcContextInterface {
  RtcEngineUnsafe: RtcEngine;
  setDualStreamMode: React.Dispatch<React.SetStateAction<DualStreamMode>>;
}

const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface,
);

export const RtcProvider = RtcContext.Provider;
export const RtcConsumer = RtcContext.Consumer;
export default RtcContext;
