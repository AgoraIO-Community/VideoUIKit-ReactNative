import React, { useState, useContext } from 'react'
import RtcContext from '../../RtcContext'
import RemoteBtnTemplate from './RemoteBtnTemplate'

function RemoteVideoMute(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);
    return (
        (props.user.uid !== 'local') ?
            <RemoteBtnTemplate
                name={props.user.video ? 'videocam' : 'videocam-off'}
                style={props.style}
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
