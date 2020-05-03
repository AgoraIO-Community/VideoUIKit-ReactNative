import React, {useContext} from 'react';
import PropsContext from '../../PropsContext';
import RtcContext, {DispatchType, UidInterface} from '../../RtcContext';
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
      name={props.user.video ? 'videocam' : 'videocamOff'}
      style={
        props.rightButton
          ? {...styles.rightRemoteBtn, ...(muteRemoteVideo as object)}
          : {...(muteRemoteVideo as object)}
      }
      onPress={() => {
        RtcEngine.muteRemoteVideoStream(
          props.user.uid as number,
          props.user.video,
        );
        (dispatch as DispatchType<'UserMuteRemoteVideo'>)({
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
