import React, { useContext } from 'react'
import PropsContext from '../../PropsContext'
import { RtcConsumer } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import styles from '../../Style'

function EndCall(props) {
    const { styleProps } = useContext(PropsContext);
    const { localBtnStyles } = styleProps;
    const { endCall } = localBtnStyles || {};

    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <BtnTemplate
                            name={'callEnd'}
                            style={{ ...styles.endCall, ...endCall }}
                            onPress={() => dispatch({ type: 'onEndCall' })} />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default EndCall;