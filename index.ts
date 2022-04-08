/**
 * @module agora-rn-uikit
 */
import AgoraUIKit from './src/AgoraUIKit';
export {StreamFallbackOptions, VideoRenderMode} from 'react-native-agora';
export {
  layout,
  DualStreamMode,
  ChannelProfile,
  ClientRole,
  ToggleState,
} from './src/Contexts/PropsContext';
export {default as icons} from './src/Controls/Icons';
export type {
  IconsInterface,
  UidInterface,
  RtcPropsInterface,
  StylePropInterface,
  CallbacksInterface,
  PropsInterface,
} from './src/Contexts/PropsContext';

export default AgoraUIKit;
