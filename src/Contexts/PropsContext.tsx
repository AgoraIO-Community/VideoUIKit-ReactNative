import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {RtcEngineEvents} from 'react-native-agora/lib/typescript/src/common/RtcEvents';
import {EncryptionMode, VideoRenderMode} from 'react-native-agora';
import {VideoProfile} from '../Utils/quality';
import {rtmCallbacks} from '../Contexts/RtmContext';

export enum DualStreamMode {
  HIGH,
  LOW,
  DYNAMIC,
}

// ClientRole & ChannelProfile is re declared here instead of importing from RN SDK, as AB web needs this enum
// Moving this to AB web wrapper would be ideal
/* User role for live streaming mode */
export enum ClientRole {
  /* 1: A host can both send and receive streams. */
  Broadcaster = 1,
  /* 2: The default role. An audience can only receive streams. */
  Audience = 2,
}

/* Mode for RTC (Live or Broadcast) */
export enum ChannelProfile {
  /** 0: (Default) The Communication profile.
   *  Use this profile in one-on-one calls or group calls, where all users can talk freely. */
  Communication = 0,
  /**  1: The Live-Broadcast profile.
   *   Users in a live-broadcast channel have a role as either host or audience. A host can both send and receive streams; an audience can only receive streams. */
  LiveBroadcasting = 1,
}
/**
 * Select a pre built layout
 */
export enum Layout {
  /**
   * 0: Grid layout: each user occupies a cell in the grid
   */
  Grid = 0,
  /**
   * 1: Pinned layout: MaxUser occupies the main view, the other users are in a floating view on top
   */
  Pin = 1,
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

/**
 * Remote Buttons styles
 */
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
  liveStreamHostControlBtns?: StyleProp<ViewStyle>;
}
/**
 * Local Buttons styles
 */
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
}

/**
 * Props object for customising the UI Kit, takes in react native styling
 */
export interface StylePropInterface {
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
  theme?: string;
  /**
   * Color tint for icons
   */
  iconSize?: number;
  /**
   * Custom base64 string for icon
   */
  customIcon?: Partial<IconsInterface>;
  /**
   * Globals style for the local buttons (except end call)
   */
  BtnTemplateStyles?: StyleProp<ViewStyle>;
  /**
   * Globals style for the local buttons (except end call)
   */
  BtnTemplateContainer?: StyleProp<ViewStyle>;
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
  /**
   * Applies style to the pop up container showing the remote mute request
   */
  popUpContainer?: StyleProp<ViewStyle>;
  /**
   * Applies style to the username text (shown if displayUsername rtcProp is true)
   */
  usernameText?: StyleProp<TextStyle>;
  /**
   * Applies style to the video placeholder component that's rendered in place when a user video is muted
   */
  videoPlaceholderContainer?: StyleProp<TextStyle>;
  /**
   * Applies style to the video placeholder component icon (rendered when a user video is muted)
   */
  videoPlaceholderIcon?: StyleProp<TextStyle>;
}

/**
 * Props object to setup the  RTC SDK connection
 */
export interface RtcConnectionData {
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
}

/**
 * Props object to customize the RTC SDK settings
 */
export interface RtcSettings {
  /**
   * Set to true to enable active speaker callback, switches the pinned video to active speaker if you're using the pinned layout. (default: false)
   */
  dual?: boolean | null;
  profile?: VideoProfile;
  initialDualStreamMode?: DualStreamMode;
  activeSpeaker?: boolean;
  /**
   * Once set to true, the UI Kit attempts to join the channel. Can be set to false to initialise the SDK and wait before joining the channel. (default: true)
   */
  callActive?: boolean;
  /**
   * Choose between grid layout and pinned layout. (default: pinned layout)
   */
  layout?: Layout;
  /**
   * Set local user's role between audience and host. Use with mode set to livestreaming. (default: host)
   */
  role?: ClientRole;
  /**
   * Select between livestreaming and communication mode for the SDK. (default: communication)
   */
  mode?: ChannelProfile;
  /**
   * Enable the mic and camera when the local user toggles role to become a host from audience role. (default: true)
   */
  enableMediaOnHost?: boolean;
  encryption?: {
    key: string;
    mode:
      | EncryptionMode.AES128XTS
      | EncryptionMode.AES256XTS
      | EncryptionMode.AES128ECB;
  };
  /**
   * Disable Agora RTM, this also disables the use of usernames and remote mute functionality
   */
  disableRtm?: boolean;
  // /**
  //  * Enable the mic before joining the call. (default: true)
  //  */
  // enableAudio?: boolean;
  // /**
  //  * Enable the camera before joining the call. Only use for initiak(default: true)
  //  */
  // enableVideo?: boolean;
}

/**
 * Props object to setup the  RTM SDK connection
 */
export interface RtmConnectionData {
  /**
   * Username for the RTM Client, this value can be accessed using the userData object
   */
  username?: string;
  /**
   * Token used to join an RTM channel when using secured mode (default: null)
   */
  token?: string | undefined;
  /**
   * UID for local user to join the RTM channel (default: uses the RTC UID)
   */
  uid?: string;
}

/**
 * Props object to customize the RTM SDK settings
 */
export interface RtmSettings {
  /**
   * Show a pop up with option to accept mute request instead of directly muting the remote user (default: true), if set to false you cannot unmute users.
   */
  showPopUpBeforeRemoteMute?: boolean;
  /**
   * Display RTM usernames in the Videocall (default: false)
   */
  displayUsername?: boolean;
}

/**
 * Props object for RTC SDK
 */
export interface RtcPropsInterface extends RtcSettings, RtcConnectionData {}
/**
 * Props object for RTM SDK
 */
export interface RtmPropsInterface extends RtmSettings, RtmConnectionData {}

export interface CallbacksInterface {
  /**
   * Callback for EndCall
   */
  EndCall(): void;
  /**
   * Callback for SwitchCamera
   */
  SwitchCamera(): void;
  UpdateDualStreamMode(mode: DualStreamMode): void;
  UserJoined: RtcEngineEvents['UserJoined'];
  UserOffline: RtcEngineEvents['UserOffline'];
  /**
   * Callback for when a user swaps video in pinned layout
   */
  SwapVideo(user: UidInterface): void;
  /**
   * Callback for when a user swaps video in pinned layout
   */
  ActiveSpeaker(uid: number | string): void;
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
  LocalMuteAudio(muted: ToggleState): void;
  /**
   * Callback for when a user mutes their video
   */
  LocalMuteVideo(muted: ToggleState): void;
  RemoteAudioStateChanged: RtcEngineEvents['RemoteAudioStateChanged'];
  RemoteVideoStateChanged: RtcEngineEvents['RemoteVideoStateChanged'];
  JoinChannelSuccess: RtcEngineEvents['JoinChannelSuccess'];
  BecomeAudience(): void;
}

export type CustomCallbacksInterface = CallbacksInterface;

// export interface CallbacksInterface
//   extends RtcEngineEvents,
//     CustomCallbacksInterface {}

/**
 * Props to setup the Agora SDK connection
 */
export interface ConnectionData
  extends Omit<RtmConnectionData, 'uid' | 'token'>,
    Omit<RtcConnectionData, 'uid' | 'token'> {
  rtcToken?: string;
  rtcUid?: number;
  rtmToken?: string;
  rtmUid?: string;
}

/**
 * Props to customize the Agora UIKit
 */
export interface Settings extends RtcSettings, RtmSettings {}

/**
 * Agora UIKit props interface
 */
export interface AgoraUIKitProps {
  /**
   * Props to setup the Agora SDK connection
   */
  connectionData: ConnectionData;
  /**
   * Props to customize the Agora UIKit
   */
  settings?: Settings;
  /**
   * Props to override the default styles for the UI
   */
  styleProps?: Partial<StylePropInterface>;
  /**
   * Callbacks for different events of the UI Kit
   */
  rtcCallbacks?: rtcCallbacks;
  /**
   * Callbacks for the signalling layer
   */
  rtmCallbacks?: rtmCallbacks;
}

export type rtcCallbacks = Partial<CallbacksInterface>;
export interface PropsInterface {
  rtcProps: RtcPropsInterface;
  rtmProps?: RtmPropsInterface;
  styleProps?: Partial<StylePropInterface>;
  callbacks?: Partial<CallbacksInterface>;
  rtmCallbacks?: rtmCallbacks;
}

const initialValue: PropsInterface = {
  rtcProps: {
    appId: '',
    channel: '',
  },
};

/**
 * Custom Icons require a base64 endcoded transparent PNG
 */
export interface IconsInterface {
  /**
   * Icon for Camera/Video mute in on state
   */
  videocam: string;
  /**
   * Icon for Camera/Video mute in off state
   */
  videocamOff: string;
  /**
   * Icon for Mic/Audio mute in on state
   */
  mic: string;
  /**
   * Icon for Mic/Audio mute in off state
   */
  micOff: string;
  /**
   * Icon to switch between device cameras
   */
  switchCamera: string;
  /**
   * Icon to end the call
   */
  callEnd: string;
  /**
   * Icon to swap the min user to max view
   */
  remoteSwap: string;
  /**
   * Icon to close the overlay in floating layout
   */
  close: string;
}

const PropsContext = React.createContext<PropsInterface>(initialValue);

export const PropsProvider = PropsContext.Provider;
export const PropsConsumer = PropsContext.Consumer;

export default PropsContext;
