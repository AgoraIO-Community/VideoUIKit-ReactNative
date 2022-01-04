import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {RtcEngineEvents} from 'react-native-agora/lib/typescript/src/common/RtcEvents';
import {EncryptionMode} from 'react-native-agora';
import {VideoProfile} from '../Utils/quality';

/** * User role for live streaming mode */
export enum ClientRole {
  /** 1: A host can both send and receive streams. */
  Broadcaster = 1,
  /** 2: The default role. An audience can only receive streams.*/
  Audience = 2,
}

/** * Mode for RTC (Live or Broadcast) */
export enum ChannelProfile {
  /** * 0: (Default) The Communication profile. Use this profile in one-on-one calls or group calls, where all users can talk freely. */
  Communication = 0,
  /** * 1: The Live-Broadcast profile. Users in a live-broadcast channel have a role as either host or audience. A host can both send and receive streams; an audience can only receive streams. */
  LiveBroadcasting = 1,
}

export enum mode {
  Live = 'live',
  Communication = 'rtc',
}

export enum role {
  Host = 'host',
  Audience = 'audience',
}

// disabled is intentionally kept as the 1st item in the enum.
// This way, it evaluates to a falsy value in a if statement
export enum ToggleState {
  disabled,
  enabled,
  disabling, // enabled -> disabling -> disabled
  enabling, // disabled -> enabling -> enabled
}

export const toggleHelper = (state: ToggleState) =>
  state === ToggleState.enabled ? ToggleState.disabled : ToggleState.enabled;

export interface UidInterface {
  // TODO: refactor local to 0 and remove string.
  uid: number | string;
  audio: ToggleState;
  video: ToggleState;
  streamType: 'high' | 'low';
}

interface remoteBtnStylesInterface {
  muteRemoteAudio?: StyleProp<ViewStyle>;
  muteRemoteVideo?: StyleProp<ViewStyle>;
  remoteSwap?: StyleProp<ViewStyle>;
  minCloseBtnStyles?: StyleProp<ViewStyle>;
  liveStreamHostControlBtns?: StyleProp<ViewStyle>;
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

export enum DualStreamMode {
  HIGH,
  LOW,
  DYNAMIC,
}

export interface RtcPropsInterface {
  appId: string;
  channel: string;
  uid?: number;
  token?: string | null;
  dual?: boolean | null;
  profile?: VideoProfile;
  initialDualStreamMode?: DualStreamMode;
  mode?: mode /* Select between livestreaming and communication mode for the SDK. (default: communication) */;
  role: role /* Set local user's role between audience and host. Use with mode set to livestreaming. (default: host) */;
  callActive?: boolean;
  encryption?: {
    key: string;
    mode:
      | EncryptionMode.AES128XTS
      | EncryptionMode.AES256XTS
      | EncryptionMode.AES128ECB;
  };
}

export interface CallbacksInterface {
  EndCall(): void; //?
  FullScreen(): void; //?
  SwitchCamera(): void; //Not in reducer
  UpdateDualStreamMode(mode: DualStreamMode): void;
  UserJoined: RtcEngineEvents['UserJoined'];
  UserOffline: RtcEngineEvents['UserOffline'];
  SwapVideo(user: UidInterface): void;
  UserMuteRemoteAudio(user: UidInterface, muted: UidInterface['audio']): void;
  UserMuteRemoteVideo(user: UidInterface, muted: UidInterface['video']): void;
  LocalMuteAudio(muted: ToggleState): void;
  LocalMuteVideo(muted: ToggleState): void;
  RemoteAudioStateChanged: RtcEngineEvents['RemoteAudioStateChanged'];
  RemoteVideoStateChanged: RtcEngineEvents['RemoteVideoStateChanged'];
  JoinChannelSuccess: RtcEngineEvents['JoinChannelSuccess'];
}

export type CustomCallbacksInterface = CallbacksInterface;

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
