import {UID} from 'agora-rtc-react';
import {RtmClient, RtmEvents} from 'agora-rtm-react';
import {createContext} from 'react';

/**
 * Callbacks to pass to RTM events
 */
export type rtmCallbacks = {
  channel?: Partial<RtmEvents.RtmChannelEvents>;
  client?: Partial<RtmEvents.RtmClientEvents>;
};

export enum rtmStatusEnum {
  // Initialisation failed
  initFailed,
  // Login has not been attempted
  offline,
  // RTM is initialising, process is not yet complete
  initialising,
  // Currently attempting to log in
  loggingIn,
  // RTM has logged in
  loggedIn,
  // RTM is logged in, and connected to the current channel
  connected,
  // RTM Login Failed
  loginFailed,
}

export type messageType = 'UserData' | 'MuteRequest';

export type messageObjectType = userDataType | muteRequest | genericAction;

export enum clientRoleRaw {
  broadcaster,
  audience,
}

export enum mutingDevice {
  camera,
  microphone,
}

export type genericAction = {
  messageType: 'RtmDataRequest';
  type: 'ping' | 'pong' | 'userData';
};

export type muteRequest = {
  messageType: 'MuteRequest';
  rtcId: UID;
  mute: boolean;
  device: mutingDevice;
  isForceful: boolean;
};

export type userDataType = {
  messageType: 'UserData';
  rtmId: string;
  rtcId: UID;
  username?: string;
  role: clientRoleRaw;
  uikit: {
    platform: string;
    framework: string;
    version: string;
  };
  agora: {
    rtm: string;
    rtc: string;
  };
};

export enum popUpStateEnum {
  closed,
  muteMic,
  muteCamera,
  unmuteMic,
  unmuteCamera,
}
/**
 * Interface for RTM Context
 */
interface rtmContext {
  /**
   * rtm connection status
   */
  rtmStatus: rtmStatusEnum;
  /**
   * send message to everyone in the channel
   */
  sendChannelMessage: (msg: messageObjectType) => void;
  /**
   * send message to a specific user
   */
  sendPeerMessage: (msg: messageObjectType, uid: string) => void;
  /**
   * RTM Client instance
   */
  rtmClient: RtmClient;
  /**
   * map with userdata for each rtc uid in the channel
   */
  userDataMap: Object;
  /**
   * map with rtm uid for each rtc uid in the channel
   */
  uidMap: Record<number, string>;
  /**
   * Send a mute request
   */
  sendMuteRequest: (device: mutingDevice, rtcId: UID, mute: boolean) => void;
  /**
   * RTM usernames
   */
  usernames: {};
  /**
   * state to display pop up on remote mute request
   */
  popUpState: popUpStateEnum;
  /**
   * set state to hide pop up
   */
  setPopUpState: React.Dispatch<React.SetStateAction<popUpStateEnum>>;
}
/**
 * Context to access RTM data. It's setup by {@link RtmConfigure}.
 */
const RtmContext = createContext(null as unknown as rtmContext);

export const RtmProvider = RtmContext.Provider;
export const RtmConsumer = RtmContext.Consumer;
export default RtmContext;
