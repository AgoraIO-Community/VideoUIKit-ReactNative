import React, {useContext} from 'react';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtmContext, {mutingDevice} from '../../Contexts/RtmContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

interface RemoteVideoMuteInterface {
  user: UidInterface;
  rightButton: boolean;
}

const RemoteVideoMute: React.FC<RemoteVideoMuteInterface> = (props) => {
  const {user} = props;
  const {sendMuteRequest, uidMap} = useContext(RtmContext || {});
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles, theme} = styleProps || {};
  const {muteRemoteVideo} = remoteBtnStyles || {};
  const isMuted = user.video === ToggleState.disabled;

  return user.uid !== 0 && uidMap[user.uid as number] ? (
    <BtnTemplate
      name={
        props.user.video === ToggleState.enabled ? 'videocam' : 'videocamOff'
      }
      style={
        props.rightButton
          ? {
              ...styles.rightRemoteBtn,
              borderColor: theme ? theme : styles.leftRemoteBtn.borderColor,
              ...(muteRemoteVideo as object),
            }
          : {...(muteRemoteVideo as object)}
      }
      onPress={() => {
        sendMuteRequest(mutingDevice.camera, user.uid as number, !isMuted);
      }}
    />
  ) : (
    <></>
  );
};

export default RemoteVideoMute;
