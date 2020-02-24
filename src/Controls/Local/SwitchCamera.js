import React, { useState } from 'react'
import { RtcConsumer } from '../../RtcContext'
import { Icon } from 'react-native-elements';

function SwitchCamera(props) {
    const [muted, setMuted] = useState(false);
    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <Icon
                            raised
                            reverse
                            name={'switch-camera'}
                            type='material'
                            color='#007aff'
                            size={18}
                            onPress={() => {
                                RtcEngine.switchCamera()
                                dispatch({ action: 'onSwitchCamera' });
                            }}
                        />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default SwitchCamera;