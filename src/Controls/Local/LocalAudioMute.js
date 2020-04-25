import React, { useState, useContext } from 'react'
import PropsContext from '../../PropsContext'
import { RtcConsumer } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import styles from '../../Style'

function LocalAudioMute(props) {
    const [muted, setMuted] = useState(false);
    const { styleProps } = useContext(PropsContext);
    const { localBtnStyles } = styleProps || {};
    const { muteLocalAudio } = localBtnStyles || {};

    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <BtnTemplate
                            name={muted ? 'micOff' : 'mic'}
                            style={{ ...styles.localBtn, ...muteLocalAudio }}
                            onPress={() => {
                                let newState = !muted;
                                setMuted(newState);
                                RtcEngine.muteLocalAudioStream(newState);
                                dispatch({ action: 'onLocalMuteAudio', value: { muted: newState } });
                            }}
                        />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default LocalAudioMute;