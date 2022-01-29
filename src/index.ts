export {default as default} from './AgoraUIKit';
export {default as RtcConfigure} from './RtcConfigure';

export {default as MaxVideoView} from './Views/MaxVideoView';
export {default as MinVideoView} from './Views/MinVideoView';

export {
  default as LocalUserContext,
  LocalConsumer,
  LocalProvider,
  LocalContext,
} from './Contexts/LocalUserContext';
export {
  default as MaxUidContext,
  MaxUidConsumer,
  MaxUidProvider,
} from './Contexts/MaxUidContext';
export {
  default as MinUidContext,
  MinUidConsumer,
  MinUidProvider,
} from './Contexts/MinUidContext';

export {
  default as PropsContext,
  PropsConsumer,
  PropsProvider,
} from './Contexts/PropsContext';

export {DualStreamMode} from './Contexts/PropsContext';

export type {
  UidInterface,
  ToggleState,
  RtcPropsInterface,
  CallbacksInterface,
  CustomCallbacksInterface,
  PropsInterface,
} from './Contexts/PropsContext';

export {ClientRole, ChannelProfile} from './Contexts/PropsContext';

export {
  default as RtcContext,
  RtcConsumer,
  RtcProvider,
} from './Contexts/RtcContext';
export type {
  RtcContextInterface,
  DispatchType,
  UidStateInterface,
  ActionInterface,
  ActionType,
} from './Contexts/RtcContext';

export {default as BtnTemplate} from './Controls/BtnTemplate';
export {default as Endcall} from './Controls/Local/EndCall';
export {default as FullScreen} from './Controls/Local/FullScreen';
export {default as LocalAudioMute} from './Controls/Local/LocalAudioMute';
export {default as LocalVideoMute} from './Controls/Local/LocalVideoMute';
export {default as SwitchCamera} from './Controls/Local/SwitchCamera';
export {default as Controls} from './Controls/LocalControls';

export {default as RemoteAudioMute} from './Controls/Remote/RemoteAudioMute';
export {default as RemoteSwap} from './Controls/Remote/RemoteSwap';
export {default as RemoteVideoMute} from './Controls/Remote/RemoteVideoMute';
export {default as RemoteControls} from './Controls/RemoteControls';

export {default as ImageIcon} from './Controls/ImageIcon';
