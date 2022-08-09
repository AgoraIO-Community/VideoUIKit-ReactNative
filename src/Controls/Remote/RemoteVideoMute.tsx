import React, {useContext} from 'react';
import useLocalUid from '../../Utils/useLocalUid';
import PropsContext, {
  ToggleState,
  RenderInterface,
} from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

interface RemoteVideoMuteInterface {
  user: RenderInterface;
  rightButton: boolean;
}

const RemoteVideoMute: React.FC<RemoteVideoMuteInterface> = (props) => {
  const {RtcEngine} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {muteRemoteVideo} = remoteBtnStyles || {};
  const localUid = useLocalUid();
  return props.user.uid !== localUid ? (
    <BtnTemplate
      name={
        props.user.video === ToggleState.enabled ? 'videocam' : 'videocamOff'
      }
      style={
        props.rightButton
          ? {...styles.rightRemoteBtn, ...(muteRemoteVideo as object)}
          : {...(muteRemoteVideo as object)}
      }
      onPress={() => {
        RtcEngine.muteRemoteVideoStream(
          props.user.uid as number,
          props.user.video === ToggleState.enabled, //If enabled, disable or vice-versa
        );
        // dispatch({
        //   type: 'UserMuteRemoteVideo',
        //   value: [props.user, props.user.video],
        // });
      }}
    />
  ) : (
    <></>
  );
};

export default RemoteVideoMute;
