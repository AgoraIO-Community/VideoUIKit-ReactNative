/**
 * @module agora-rn-uikit
 */
import AgoraUIKit from './src/AgoraUIKit';
export {StreamFallbackOptions, VideoRenderMode} from 'react-native-agora';
export {layout} from './src/Contexts/PropsContext';
export type {
  RtcPropsInterface,
  StylePropInterface,
  CallbacksInterface,
  PropsInterface,
} from './src/Contexts/PropsContext';

export default AgoraUIKit;
