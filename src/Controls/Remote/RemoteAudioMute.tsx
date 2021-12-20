import React, {useContext} from 'react';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext, {ToggleState, UidInterface} from '../../Contexts/PropsContext';

interface RemoteAudioMuteInterface {
  user: UidInterface;
}

const RemoteAudioMute: React.FC<RemoteAudioMuteInterface> = (props) => {
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};

  return props.user.uid !== 'local' ? (
    <BtnTemplate
      name={props.user.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      style={{...styles.leftRemoteBtn, ...(muteRemoteAudio as object)}}
      onPress={() => {
        RtcEngine.muteRemoteAudioStream(
          props.user.uid as number,
          props.user.audio === ToggleState.enabled,
        );
        // dispatch({
        //   type: 'UserMuteRemoteAudio',
        //   value: [props.user, props.user.audio],
        // });
      }}
    />
  ) : (
    <></>
  );
};

export default RemoteAudioMute;
