import React, {useContext} from 'react';
import RtcContext, {UidInterface, DispatchType} from '../../RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext from '../../PropsContext';

interface RemoteAudioMuteInterface {
  user: UidInterface;
}

const RemoteAudioMute: React.FC<RemoteAudioMuteInterface> = (props) => {
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles, theme} = styleProps || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};

  return props.user.uid !== 'local' ? (
    <BtnTemplate
      name={props.user.audio ? 'mic' : 'micOff'}
      style={{
        ...styles.leftRemoteBtn,
        borderColor: theme ? theme : styles.leftRemoteBtn.borderColor,
        ...(muteRemoteAudio as object),
      }}
      onPress={() => {
        RtcEngine.muteRemoteAudioStream(
          props.user.uid as number,
          props.user.audio,
        );
        (dispatch as DispatchType<'UserMuteRemoteAudio'>)({
          type: 'UserMuteRemoteAudio',
          value: [props.user, props.user.audio],
        });
      }}
    />
  ) : (
    <></>
  );
};

export default RemoteAudioMute;
