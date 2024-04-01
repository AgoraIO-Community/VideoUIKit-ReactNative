import React from 'react';
import {CallbacksInterface} from './PropsContext';
import {IRtcEngine} from 'react-native-agora';
import type {DualStreamMode, ContentInterface} from './PropsContext';

export type UidType = number;

export interface ContentObjects {
  [key: number]: ContentInterface;
}

type JSXElement = () => JSX.Element;
export interface CustomContentInferface {
  uid: UidType;
  component: boolean | React.ComponentType | JSXElement;
  props: any;
  onStage?: boolean; //true by default
}

export interface CustomContentObjects {
  [key: number]: CustomContentInferface;
}
export interface ContentStateInterface {
  customContent?: CustomContentObjects;
  setCustomContent: (
    uid: CustomContentInferface['uid'],
    component: CustomContentInferface['component'],
    props?: CustomContentInferface['props'],
    onStage?: CustomContentInferface['onStage'],
  ) => void;
  defaultContent: ContentObjects;
  activeUids: Array<UidType>;
  pinnedUid?: UidType;
  secondaryPinnedUid?: UidType;
  lastJoinedUid?: UidType;
}

export interface ActionInterface<T extends keyof CallbacksInterface> {
  type: T;
  value: Parameters<CallbacksInterface[T]>;
}

export type ActionType<T extends keyof CallbacksInterface> = ActionInterface<T>;

export interface RtcContextInterface {
  RtcEngineUnsafe: IRtcEngine;
  setDualStreamMode: React.Dispatch<React.SetStateAction<DualStreamMode>>;
}

const RtcContext = React.createContext<RtcContextInterface>(
  {} as RtcContextInterface,
);

export const RtcProvider = RtcContext.Provider;
export const RtcConsumer = RtcContext.Consumer;
export default RtcContext;
