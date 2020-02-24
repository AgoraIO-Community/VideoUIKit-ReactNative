import React, { useState } from 'react'
import { RtcConsumer } from '../../RtcContext'
import { Icon } from 'react-native-elements';

function LocalVideoMute(props) {
    const [muted, setMuted] = useState(false);
    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <Icon
                            raised
                            reverse
                            name={muted ? 'videocam-off' : 'videocam'}
                            type='material'
                            color='#007aff'
                            size={18}
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