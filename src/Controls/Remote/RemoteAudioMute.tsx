import React, {useContext} from 'react';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtmContext, {mutingDevice} from '../../Contexts/RtmContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

interface RemoteAudioMuteInterface {
  user: UidInterface;
}

const RemoteAudioMute: React.FC<RemoteAudioMuteInterface> = (props) => {
  const {user} = props;
  const {sendMuteRequest, uidMap} = useContext(RtmContext || {});
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const isMuted = user.audio === ToggleState.disabled;

  return user.uid !== 0 && uidMap[user.uid as number] ? (
    <BtnTemplate
      name={props.user.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      style={{...styles.leftRemoteBtn, ...(muteRemoteAudio as object)}}
      onPress={() => {
        sendMuteRequest(mutingDevice.microphone, user.uid as number, !isMuted);
      }}
    />
  ) : (
    <></>
  );
};

export default RemoteAudioMute;
