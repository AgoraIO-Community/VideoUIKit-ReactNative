import React, {useContext} from 'react';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

interface RemoteVideoMuteInterface {
  user: UidInterface;
  rightButton: boolean;
}

const RemoteVideoMute: React.FC<RemoteVideoMuteInterface> = (props) => {
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {muteRemoteVideo} = remoteBtnStyles || {};

  return props.user.uid !== 'local' ? (
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
        dispatch({
          type: 'UserMuteRemoteVideo',
          value: [props.user, props.user.video],
        });
      }}
    />
  ) : (
    <></>
  );
};

export default RemoteVideoMute;
