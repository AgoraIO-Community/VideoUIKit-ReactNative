import React, { useContext } from 'react';
import PropsContext from '../../PropsContext';
import RtcContext from '../../RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

function RemoteVideoMute(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);
    const { styleProps } = useContext(PropsContext);
    const { remoteBtnStyles } = styleProps || {};
    const { muteRemoteVideo } = remoteBtnStyles || {};

    return (
        (props.user.uid !== 'local') ?
            <BtnTemplate
                name={props.user.video ? 'videocam' : 'videocamOff'}
                style={(props.rightButton) ? { ...styles.rightRemoteBtn, ...muteRemoteVideo } : {...muteRemoteVideo}}
                onPress={
                    () => {
                        RtcEngine.muteRemoteVideoStream(props.user.uid, props.user.video);
                        dispatch({ type: 'onUserMuteRemoteVideo', value: { user: props.user, muted: props.user.video } });
                    }
                }
            /> : <></>
    )
}

export default RemoteVideoMute;
