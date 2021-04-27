import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {VideoRenderMode} from 'react-native-agora/src/common/Enums';
import {RtcEngineEvents} from 'react-native-agora/src/common/RtcEvents';

interface UidInterface {
  // TODO: refactor local to 0 and remove string.
  uid: number | string;
  audio: boolean;
  video: boolean;
}

interface remoteBtnStylesInterface {
  /**
   * Style for the remote mute audio button
   */
  muteRemoteAudio?: StyleProp<ViewStyle>;
  /**
   * Style for the remote mute video button
   */
  muteRemoteVideo?: StyleProp<ViewStyle>;
  /**
   * Style for the remote swap button in pinned layout
   */
  remoteSwap?: StyleProp<ViewStyle>;
  /**
   * Style for the overlay close button
   */
  minCloseBtnStyles?: StyleProp<ViewStyle>;
}

interface localBtnStylesInterface {
  /**
   * Style for the local mute audio button
   */
  muteLocalAudio?: StyleProp<ViewStyle>;
  /**
   * Style for the local mute video button
   */
  muteLocalVideo?: StyleProp<ViewStyle>;
  /**
   * Style for the switch camera button
   */
  switchCamera?: StyleProp<ViewStyle>;
  /**
   * Style for the end call button
   */
  endCall?: StyleProp<ViewStyle>;
  /**
   * Style for the fullscreen button
   */
  fullScreen?: StyleProp<ViewStyle>;
}

interface StylePropInterface {
  /**
   * Color tint for icons
   */
  theme?: string;
  /**
   * Sets the scaling of the video
   */
  videoMode?: {
    max?: VideoRenderMode;
    min?: VideoRenderMode;
  };
  /**
   * Color tint for icons
   */
  iconSize?: number;
  /**
   * Globals style for the local buttons (except end call)
   */
  BtnTemplateStyles?: StyleProp<ViewStyle>;
  /**
   * Style for the big view in pinned layout
   */
  maxViewStyles?: StyleProp<ViewStyle>;
  /**
   * Style for the small view in pinned layout
   */
  minViewStyles?: StyleProp<ViewStyle>;
  /**
   * Style for the small view container
   */
  minViewContainer?: StyleProp<ViewStyle>;
  /**
   * Style for the overlay on small user view when pressed in pinned layout
   */
  overlayContainer?: StyleProp<ViewStyle>;
  /**
   * Style for the remote button
   */
  remoteBtnStyles?: remoteBtnStylesInterface;
  /**
   * Style for the remote button container
   */
  remoteBtnContainer?: StyleProp<ViewStyle>;
  /**
   * Style for specific local buttons, overrides the style applied by BtnTemplateStyles prop
   */
  localBtnStyles?: localBtnStylesInterface;
  /**
   * Style for the local button container
   */
  localBtnContainer?: StyleProp<ViewStyle>;
  /**
   * Style for the button container that sets the mute and unmute for maxVideoView in pinned layout, only visible if max view is remote user
   */
  maxViewRemoteBtnContainer?: StyleProp<ViewStyle>;
  /**
   * Applies style to the individual cell (view) containing the video in the grid layout
   */
  gridVideoView?: StyleProp<ViewStyle>;
  /**
   * Applies style to the global view containing the UI Kit
   */
  UIKitContainer?: StyleProp<ViewStyle>;
}

export interface RtcPropsInterface {
  /**
   * Agora App ID - used to authenticate the request
   */
  appId: string;
  /**
   * Channel name to join - users in the same channel can communicate with each other
   */
  channel: string;
  /**
   * (optional) UID for local user to join the channel (default: 0)
   */
  uid?: number;
  /**
   * (optional) Token used to join a channel when using secured mode (default: null)
   */
  token?: string | null;
  /**
   * (optional) URL for token server, manages fetching and updating tokens automatically. Must follow the schema here - https://github.com/AgoraIO-Community/agora-token-service/
   */
  tokenUrl?: string;
  /**
   * Set to true to enable active speaker callback, switches the pinned video to active speaker if you're using the pinned layout. (default: false)
   */
  activeSpeaker?: boolean;
  /**
   * Once set to true, the UI Kit attempts to join the channel. Can be set to false to initialise the SDK and wait before joining the channel. (default: true)
   */
  callActive?: boolean;
  /**
   * Enables dual stream mode. (default: false)
   */
  enableDualStream?: boolean;
  /**
   * Choose between grid layout and pinned layout. (default: pinned layout)
   */
  layout?: layout;
  /**
   * Set local user's role between audience and host. Use with mode set to livestreaming. (default: host)
   */
  role?: role;
  /**
   * Select between livestreaming and communication mode for the SDK. (default: communication)
   */
  mode?: mode;
  /**
   * Enable the mic before joining the call. (default: true)
   */
  enableAudio?: boolean;
  /**
   * Enable the camera before joining the call. Only use for initiak(default: true)
   */
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
  /**
   * Callback for EndCall
   */
  EndCall(): void;
  /**
   * Callback for Fullscreen
   */
  FullScreen(): void;
  /**
   * Callback for SwitchCamera
   */
  SwitchCamera(): void;
  /**
   * Callback for when a user swaps video in pinned layout
   */
  SwapVideo(user: UidInterface): void;
  /**
   * Callback for when a user mutes a remote user's audio
   */
  UserMuteRemoteAudio(user: UidInterface, muted: UidInterface['audio']): void;
  /**
   * Callback for when a user mutes a remote user's video
   */
  UserMuteRemoteVideo(user: UidInterface, muted: UidInterface['video']): void;
  /**
   * Callback for when a user mutes their audio
   */
  LocalMuteAudio(muted: boolean): void;
  /**
   * Callback for when a user mutes their video
   */
  LocalMuteVideo(muted: boolean): void;
}

export interface CallbacksInterface
  extends RtcEngineEvents,
    CustomCallbacksInterface {}

export interface PropsInterface {
  /**
   * Props used to customise the UI Kit's functionality
   */
  rtcProps: RtcPropsInterface;
  /**
   * Props used to customise the UI Kit's appearance (accepts style object for different components)
   */
  styleProps?: Partial<StylePropInterface>;
  /**
   * Callbacks for different functions of the UI Kit
   */
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
