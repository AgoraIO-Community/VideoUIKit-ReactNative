import React, {useContext} from 'react';
import {View} from 'react-native';
import {UidType} from '../Contexts/RtcContext';
import PropsContext, {RenderInterface} from '../Contexts/PropsContext';
import styles from '../Style';
import RemoteAudioMute from './Remote/RemoteAudioMute';
import RemoteSwap from './Remote/RemoteSwap';
import RemoteVideoMute from './Remote/RemoteVideoMute';

interface RemoteControlsInterface {
  showMuteRemoteVideo?: boolean;
  showMuteRemoteAudio?: boolean;
  showRemoteSwap?: boolean;
  user: RenderInterface;
  uid: UidType;
}

const RemoteControls: React.FC<RemoteControlsInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnContainer} = styleProps || {};

  return (
    <View
      style={{...styles.remoteBtnContainer, ...(remoteBtnContainer as object)}}>
      {props.showMuteRemoteAudio !== false ? (
        <RemoteAudioMute user={props.user} uid={props.uid} />
      ) : (
        <></>
      )}
      {props.showMuteRemoteVideo !== false ? (
        <RemoteVideoMute
          rightButton={!props.showRemoteSwap}
          user={props.user}
          uid={props.uid}
        />
      ) : (
        <></>
      )}
      {props.showRemoteSwap !== false ? <RemoteSwap uid={props.uid} /> : <></>}
    </View>
  );
};

export default RemoteControls;
