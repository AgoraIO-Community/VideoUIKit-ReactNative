import React, {useContext} from 'react';
import PropsContext from '../../PropsContext';
import RtcContext, {DispatchType} from '../../RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../LocalUserContext';

function LocalVideoMute() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {muteLocalVideo} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);
  const muted = !local.video;

  return (
    <BtnTemplate
      name={muted ? 'videocamOff' : 'videocam'}
      style={{...styles.localBtn, ...(muteLocalVideo as object)}}
      onPress={() => {
        let newState = !muted;
        (dispatch as DispatchType<'LocalMuteVideo'>)({
          type: 'LocalMuteVideo',
          value: [newState],
        });
      }}
    />
  );
}

export default LocalVideoMute;
