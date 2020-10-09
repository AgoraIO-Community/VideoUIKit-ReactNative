import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {RtcEngineEvents} from 'react-native-agora/lib/RtcEvents';
import { EncryptionMode } from 'react-native-agora';

interface UidInterface {
  // TODO: refactor local to 0 and remove string.
  uid: number | string;
  audio: boolean;
  video: boolean;
}

interface remoteBtnStylesInterface {
  muteRemoteAudio?: StyleProp<ViewStyle>;
  muteRemoteVideo?: StyleProp<ViewStyle>;
  remoteSwap?: StyleProp<ViewStyle>;
  minCloseBtnStyles?: StyleProp<ViewStyle>;
}

interface localBtnStylesInterface {
  muteLocalAudio?: StyleProp<ViewStyle>;
  muteLocalVideo?: StyleProp<ViewStyle>;
  switchCamera?: StyleProp<ViewStyle>;
  endCall?: StyleProp<ViewStyle>;
  fullScreen?: StyleProp<ViewStyle>;
}

interface StylePropInterface {
  theme?: string;
  BtnTemplateStyles?: StyleProp<ViewStyle>;
  maxViewStyles?: StyleProp<ViewStyle>;
  minViewStyles?: StyleProp<ViewStyle>;
  remoteBtnStyles?: remoteBtnStylesInterface;
  remoteBtnContainer?: StyleProp<ViewStyle>;
  localBtnStyles?: localBtnStylesInterface;
  localBtnContainer?: StyleProp<ViewStyle>;
}

export interface RtcPropsInterface {
  appId: string;
  channel: string;
  uid?: number;
  token?: string | null;
  dual?: boolean | null;
  encryption?: {
    key: string;
    mode:
      | EncryptionMode.AES128XTS
      | EncryptionMode.AES256XTS
      | EncryptionMode.AES128ECB;
  };
}

export interface CustomCallbacksInterface {
  EndCall(): void;
  FullScreen(): void;
  SwitchCamera(): void;
  SwapVideo(user: UidInterface): void;
  UserMuteRemoteAudio(user: UidInterface, muted: UidInterface['audio']): void;
  UserMuteRemoteVideo(user: UidInterface, muted: UidInterface['video']): void;
  LocalMuteAudio(muted: boolean): void;
  LocalMuteVideo(muted: boolean): void;
}

export interface CallbacksInterface
  extends RtcEngineEvents,
    CustomCallbacksInterface {}

export interface PropsInterface {
  rtcProps: RtcPropsInterface;
  styleProps?: Partial<StylePropInterface>;
  callbacks?: Partial<CallbacksInterface>;
}

const initialValue: PropsInterface = {
  rtcProps: {
    appId: '',
    channel: '',
  },
};

const PropsContext = React.createContext<PropsInterface>(initialValue);

export const PropsProvider = PropsContext.Provider;
export const PropsConsumer = PropsContext.Consumer;

export default PropsContext;
