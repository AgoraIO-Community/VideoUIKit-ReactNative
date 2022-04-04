import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {RtcEngineEvents} from 'react-native-agora/lib/typescript/src/common/RtcEvents';
import {EncryptionMode} from 'react-native-agora';
import {VideoProfile} from '../Utils/quality';
import {UidStateInterface} from './RtcContext';
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

interface DefaultUidInterface {
  // TODO: refactor local to 0 and remove string.
  uid: number | string;
  audio: ToggleState;
  video: ToggleState;
  streamType: 'high' | 'low';
  type: 'rtc';
}

export interface UserUidInterface<T> {
  type: T extends DefaultUidInterface['type'] ? never : T
}

interface UserEnteredInterface extends UserUidInterface<string> {
  [key: string] :any,
}

interface DefaultUidInterface {
  uid: number | string;
  audio: ToggleState;
  video: ToggleState;
  streamType: 'high' | 'low';
  type: 'rtc';
}

export type UidInterface = DefaultUidInterface | UserEnteredInterface;

// export interface UidInterface {
//   // TODO: refactor local to 0 and remove string.
//   uid: number | string;
//   audio: ToggleState;
//   video: ToggleState;
//   streamType: 'high' | 'low';
//   type: 'rtc';
// }

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
  callActive?: boolean;
  encryption?: {
    key: string;
    mode:
      | EncryptionMode.AES128XTS
      | EncryptionMode.AES256XTS
      | EncryptionMode.AES128ECB;
  };
  lifecycle?: {
    useBeforeJoin?: () => () => Promise<void>,
    useBeforeCreate?: () => () => Promise<void>
  }
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
  SetState(
    param: UidStateInterface | ((p: UidStateInterface) => UidStateInterface),
  ): void;
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
