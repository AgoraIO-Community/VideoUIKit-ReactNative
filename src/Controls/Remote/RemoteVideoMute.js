import React, { useState, useContext } from 'react'
import RtcContext from '../../RtcContext'
import RemoteBtnTemplate from './RemoteBtnTemplate'
import PropsContext from '../../PropsContext'

function RemoteVideoMute(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);
    const { styleProps } = useContext(PropsContext);
    const { remoteBtnStyles } = styleProps;
    const { muteRemoteVideo } = remoteBtnStyles || {};

    return (
        (props.user.uid !== 'local') ?
            <RemoteBtnTemplate
                name={props.user.video ? 'videocam' : 'videocam-off'}
                style={muteRemoteVideo}
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
