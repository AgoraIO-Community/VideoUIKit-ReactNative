import React, { useState, useContext } from 'react'
import RtcContext from '../../RtcContext'
import RemoteBtnTemplate from './RemoteBtnTemplate'
import styles from '../../Style'

function RemoteAudioMute(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);

    return (
        (props.user.uid !== 'local') ?
            <RemoteBtnTemplate
                name={props.user.audio ? 'mic' : 'mic-off'}
                style={{ ...styles.leftRemoteBtn, ...props.style }}
                onPress={
                    () => {
                        RtcEngine.muteRemoteAudioStream(props.user.uid, props.user.audio);
                        dispatch({ type: 'onUserMuteRemoteAudio', value: { user: props.user, muted: props.user.audio } });
                    }
                }
            /> : <></>
    )
}

export default RemoteAudioMute;
