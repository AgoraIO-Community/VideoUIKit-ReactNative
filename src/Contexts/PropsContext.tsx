import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {IRtcEngineEventHandler} from 'react-native-agora';
import {EncryptionMode} from 'react-native-agora';
import {VideoProfile} from '../Utils/quality';
import {UidType} from './RtcContext';

/* User role for live streaming mode */
export enum ClientRoleType {
  /**
   * 1: Host. A host can both send and receive streams.
   */
  ClientRoleBroadcaster = 1,
  /**
   * 2: (Default) Audience. An audience member can only receive streams.
   */
  ClientRoleAudience = 2,
}

/* Mode for RTC (Live or Broadcast) */
export enum ChannelProfileType {
  /**
   * 0: Communication. Use this profile when there are only two users in the channel.
   */
  ChannelProfileCommunication = 0,
  /**
   * 1: Live streaming. Live streaming. Use this profile when there are more than two users in the channel.
   */
  ChannelProfileLiveBroadcasting = 1,
  /**
   * 2: Gaming. This profile is deprecated.
   */
  ChannelProfileGame = 2,
  /**
   * Cloud gaming. The scenario is optimized for latency. Use this profile if the use case requires frequent interactions between users.
   */
  ChannelProfileCloudGaming = 3,
  /**
   * @ignore
   */
  ChannelProfileCommunication1v1 = 4,
}

// disabled is intentionally kept as the 1st item in the enum.
// This way, it evaluates to a falsy value in a if statement
export enum ToggleState {
  disabled,
  enabled,
  disabling, // enabled -> disabling -> disabled
  enabling, // disabled -> enabling -> enabled
}

export enum PermissionState {
  NOT_REQUESTED,
  REQUESTED,
  GRANTED_FOR_CAM_AND_MIC,
  GRANTED_FOR_CAM_ONLY,
  GRANTED_FOR_MIC_ONLY,
  REJECTED,
  CANCELLED,
}

export const toggleHelper = (state: ToggleState) =>
  state === ToggleState.enabled ? ToggleState.disabled : ToggleState.enabled;

export interface DefaultContentInterface {
  //uikit and core
  uid: UidType;
  audio: ToggleState;
  video: ToggleState;
  streamType: 'high' | 'low';
  type: 'rtc' | 'screenshare';
  permissionStatus?: PermissionState;
  audioForceDisabled?: boolean;
  videoForceDisabled?: boolean;
  //applicable only to the screenshare
  parentUid?: UidType;
  //uikit and core

  //core only
  name: string;
  screenUid: number;
  offline: boolean;
  lastMessageTimeStamp: number;
  isInWaitingRoom?: boolean;
  //core only
}
export interface CustomContentInterface<T> {
  type: T extends DefaultContentInterface['type'] ? never : T;
}
export interface ExtenedContentInterface
  extends CustomContentInterface<string> {
  [key: string]: any;
}
export type ContentInterface =
  | DefaultContentInterface
  | ExtenedContentInterface;

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
  uid?: UidType;
  token?: string | null;
  dual?: boolean | null;
  profile?: VideoProfile;
  screenShareProfile?: string;
  initialDualStreamMode?: DualStreamMode;
  role?: ClientRoleType /* Set local user's role between audience and host. Use with mode set to livestreaming. (default: host) */;
  callActive?: boolean;
  encryption?: {
    key: string;
    mode: EncryptionMode.Aes128Gcm2 | EncryptionMode.Aes256Gcm2;
    salt: number[];
  };
  // commented for v1 release
  // lifecycle?: {
  //   useBeforeJoin?: () => () => Promise<void>;
  //   useBeforeCreate?: () => () => Promise<void>;
  // };
  geoFencing?: boolean;
  audioRoom?: boolean;
  activeSpeaker?: boolean;
  preventJoin?: boolean;

  //core only
  screenShareUid?: number;
  screenShareToken?: string;
  recordingBot?: false;
  //core only
}

export interface CallbacksInterface {
  EndCall(): void; //?
  FullScreen(): void; //?
  SwitchCamera(): void; //Not in reducer
  UpdateDualStreamMode(mode: DualStreamMode): void;
  UserJoined: IRtcEngineEventHandler['onUserJoined'];
  UserOffline: IRtcEngineEventHandler['onUserOffline'];
  SwapVideo(uid: UidType): void;
  DequeVideo(uid: UidType): void;
  UserMuteRemoteAudio(uid: UidType, muted: ContentInterface['audio']): void;
  UserMuteRemoteVideo(uid: UidType, muted: ContentInterface['video']): void;
  LocalMuteAudio(muted: ToggleState, forceDisabled?: boolean): void;
  LocalMuteVideo(muted: ToggleState, forceDisabled?: boolean): void;
  LocalPermissionState(
    permissionState: ContentInterface['permissionStatus'],
  ): void;
  RemoteAudioStateChanged: IRtcEngineEventHandler['onRemoteAudioStateChanged'];
  RemoteVideoStateChanged: IRtcEngineEventHandler['onRemoteVideoStateChanged'];
  JoinChannelSuccess: IRtcEngineEventHandler['onJoinChannelSuccess'];
  UpdateRenderList(uid: UidType, user: Partial<ContentInterface>): void;
  AddCustomContent(uid: UidType, data: any): void;
  RemoveCustomContent(uid: UidType): void;
  UserPin(Uid: UidType): void;
  UserSecondaryPin(Uid: UidType): void;
  ActiveSpeaker(Uid: UidType): void;
}

export type CustomCallbacksInterface = CallbacksInterface;

export interface PropsInterface {
  rtcProps: RtcPropsInterface;
  styleProps?: Partial<StylePropInterface>;
  callbacks?: Partial<CallbacksInterface>;
  mode?: ChannelProfileType;
}

const initialValue: Partial<PropsInterface> = {
  rtcProps: {
    appId: '',
    channel: '',
    geoFencing: true,
    audioRoom: false,
    preventJoin: true,
  },
};

const PropsContext = React.createContext<Partial<PropsInterface>>(initialValue);

export const PropsProvider = PropsContext.Provider;
export const PropsConsumer = PropsContext.Consumer;

export default PropsContext;
