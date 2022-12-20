/**
 * @module Agora UIKit
 */
import AgoraUIKit from './src/AgoraUIKit';
export {
  StreamFallbackOptions,
  RenderModeType,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';
export {Layout, DualStreamMode, ToggleState} from './src/Contexts/PropsContext';
export {default as icons} from './src/Controls/Icons';
export type {
  IconsInterface,
  UidInterface,
  AgoraUIKitProps,
  ConnectionData,
  Settings,
  StylePropInterface,
  rtcCallbacks,
} from './src/Contexts/PropsContext';
export type {rtmCallbacks} from './src/Contexts/RtmContext';

export default AgoraUIKit;
