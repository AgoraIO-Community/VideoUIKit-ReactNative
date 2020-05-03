import React, {useContext} from 'react';
import PropsContext from '../../PropsContext';
import RtcContext, {DispatchType} from '../../RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../LocalUserContext';

function LocalAudioMute() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {muteLocalAudio} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);
  const muted = !local.audio;

  return (
    <BtnTemplate
      name={muted ? 'micOff' : 'mic'}
      style={{...styles.localBtn, ...(muteLocalAudio as object)}}
      onPress={() => {
        let newState = !muted;
        (dispatch as DispatchType<'LocalMuteAudio'>)({
          type: 'LocalMuteAudio',
          value: [newState],
        });
      }}
    />
  );
}

export default LocalAudioMute;
