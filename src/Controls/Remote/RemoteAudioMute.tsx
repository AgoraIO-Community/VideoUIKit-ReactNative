import React, {useContext} from 'react';
import RtcContext, {UidType} from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext, {
  ToggleState,
  ContentInterface,
} from '../../Contexts/PropsContext';
import useLocalUid from '../../Utils/useLocalUid';

interface RemoteAudioMuteInterface {
  user: ContentInterface;
}

const RemoteAudioMute: React.FC<RemoteAudioMuteInterface> = (props) => {
  const {RtcEngineUnsafe} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const localUid = useLocalUid();
  return props.user.uid !== localUid ? (
    <BtnTemplate
      //@ts-ignore
      name={props.user.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      style={{...styles.leftRemoteBtn, ...(muteRemoteAudio as object)}}
      onPress={() => {
        RtcEngineUnsafe.muteRemoteAudioStream(
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
