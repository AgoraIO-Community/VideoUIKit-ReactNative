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
function LocalAudioMute(props: Props) {
  const {btnText = 'Audio', variant = 'Outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalAudio} = localBtnStyles || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return (
    <BtnTemplate
      name={local.audio ? 'mic' : 'micOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'Outlined'
          ? (muteLocalAudio as object)
          : (muteRemoteAudio as object)),
      }}
      onPress={() => {
        (dispatch as DispatchType<'LocalMuteAudio'>)({
          type: 'LocalMuteAudio',
          value: [local.audio],
        });
      }}
    />
  );
}

export default LocalAudioMute;
