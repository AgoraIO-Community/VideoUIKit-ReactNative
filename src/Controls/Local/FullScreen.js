import React, { useState } from 'react'
import { RtcConsumer } from '../../RtcContext'
import { Icon } from 'react-native-elements';

function FullScreen(props) {
    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <Icon
                            raised
                            reverse
                            name={'fullscreen'}
                            type='material'
                            color='#007aff'
                            size={18}
                            onPress={() => { dispatch({ action: 'onFullScreen' }) }}
                        />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default FullScreen;