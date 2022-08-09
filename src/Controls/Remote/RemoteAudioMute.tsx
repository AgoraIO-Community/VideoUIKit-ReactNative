import React, {useContext} from 'react';
import RtcContext, {UidType} from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext, {
  ToggleState,
  RenderInterface,
} from '../../Contexts/PropsContext';
import useLocalUid from '../../Utils/useLocalUid';

interface RemoteAudioMuteInterface {
  user: RenderInterface;
}

const RemoteAudioMute: React.FC<RemoteAudioMuteInterface> = (props) => {
  const {RtcEngine} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const localUid = useLocalUid();
  return props.user.uid !== localUid ? (
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
