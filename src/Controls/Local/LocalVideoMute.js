import React, { useState, useContext } from 'react'
import PropsContext from '../../PropsContext'
import { RtcConsumer } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import styles from '../../Style'

function LocalVideoMute(props) {
    const [muted, setMuted] = useState(false);
    const { styleProps } = useContext(PropsContext);
    const { localBtnStyles } = styleProps || {};
    const { muteLocalVideo } = localBtnStyles || {};

    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <BtnTemplate
                            name={muted ? 'videocamOff' : 'videocam'}
                            style={{ ...styles.localBtn, ...muteLocalVideo }}
                            onPress={() => {
                                let newState = !muted;
                                setMuted(newState);
                                RtcEngine.muteLocalVideoStream(newState);
                                dispatch({ action: 'onLocalMuteVideo', value: { muted: newState } });
                            }}
                        />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default LocalVideoMute;