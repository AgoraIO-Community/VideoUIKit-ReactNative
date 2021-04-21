import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {RtcEngineEvents} from 'react-native-agora/src/common/RtcEvents';

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
  UIKitContainer?: StyleProp<ViewStyle>;
}

export interface RtcPropsInterface {
  appId: string;
  channel: string;
  uid?: number;
  token?: string | null;
  tokenUrl?: string;
  // manualDualStream?: number;
  activeSpeaker?: boolean;
  callActive?: boolean;
  enableDualStream?: boolean;
  layout?: layout;
  role?: role;
  mode?: mode;
  enableAudio?: boolean;
  enableVideo?: boolean;
}

export enum layout {
  /**
   * 0: Grid layout: each user occupies a cell in the grid
   */
  grid = 0,
  /**
   * 2: Pinned layout: MaxUser occupies the main view, the other users are in a floating view on top
   */
  pin = 1,
}
export enum role {
  /**
   * 1: A host can both send and receive streams.
   */
  Broadcaster = 1,
  /**
   * 2: The default role. An audience can only receive streams.
   */
  Audience = 2,
}
export enum mode {
  /**
   * 0: (Default) The Communication profile.
   * Use this profile in one-on-one calls or group calls, where all users can talk freely.
   */
  Communication = 0,
  /**
   * 1: The Live-Broadcast profile.
   * Users in a live-broadcast channel have a role as either host or audience. A host can both send and receive streams; an audience can only receive streams.
   */
  LiveBroadcasting = 1,
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
