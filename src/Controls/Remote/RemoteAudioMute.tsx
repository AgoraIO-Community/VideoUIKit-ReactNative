import React, {useContext} from 'react';
// import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtmContext, {mutingDevice} from '../../Contexts/RtmContext';

interface RemoteAudioMuteInterface {
  user: UidInterface;
}

const RemoteAudioMute: React.FC<RemoteAudioMuteInterface> = (props) => {
  // const {RtcEngine, dispatch} = useContext(RtcContext);
  const {sendMuteRequest, uidMap} = useContext(RtmContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {user} = props;
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const isMuted = user.audio === ToggleState.disabled;

  return user.uid !== 0 && uidMap[user.uid as number] ? (
    <BtnTemplate
      name={props.user.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      style={{...styles.leftRemoteBtn, ...(muteRemoteAudio as object)}}
      onPress={() => {
        sendMuteRequest(mutingDevice.microphone, user.uid, !isMuted);
        // RtcEngine.muteRemoteAudioStream(
        //   props.user.uid as number,
        //   props.user.audio === ToggleState.enabled,
        // );
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
