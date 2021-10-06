import React, {useContext} from 'react';
import PropsContext from '../../PropsContext';
import RtcContext, {DispatchType} from '../../RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../LocalUserContext';

interface Props {
  btnText?: string;
  variant?: 'outlined' | 'text';
}

function LocalVideoMute(props: Props) {
  const {btnText = 'Video', variant = 'Outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalVideo} = localBtnStyles || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return (
    <BtnTemplate
      name={local.video ? 'videocam' : 'videocamOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'Outlined'
          ? (muteLocalVideo as object)
          : (muteRemoteAudio as object)),
      }}
      onPress={() => {
        (dispatch as DispatchType<'LocalMuteVideo'>)({
          type: 'LocalMuteVideo',
          value: [local.video],
        });
      }}
    />
  );
}

export default LocalVideoMute;
