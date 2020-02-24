import React from 'react'
import { RtcConsumer } from '../../RtcContext'
import { Icon } from 'react-native-elements';

function EndCall(props) {
    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <Icon
                            raised
                            reverse
                            name='call-end'
                            type='material'
                            color='red'
                            size={30}
                            onPress={() => dispatch({ type: 'onEndCall' })} />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default EndCall;