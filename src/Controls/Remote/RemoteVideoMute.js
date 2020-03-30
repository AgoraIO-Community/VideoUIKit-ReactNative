import React, { useState, useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import PropsContext from '../../PropsContext'
import styles from '../../Style';

function RemoteVideoMute(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);
    const { styleProps } = useContext(PropsContext);
    const { remoteBtnStyles } = styleProps;
    const { muteRemoteVideo } = remoteBtnStyles || {};
    console.log("chk:"+props.rightButton)
    return (
        (props.user.uid !== 'local') ?
            <BtnTemplate
                name={props.user.video ? 'videocam' : 'videocam-off'}
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
