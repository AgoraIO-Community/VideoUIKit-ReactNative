import React, { useState } from 'react'
import { RtcConsumer } from '../../RtcContext'
import { Icon } from 'react-native-elements';

function LocalAudioMute(props) {
    const [muted, setMuted] = useState(false);
    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <Icon
                            raised
                            reverse
                            name={muted ? 'mic-off' : 'mic'}
                            type='material'
                            color='#007aff'
                            size={18}
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