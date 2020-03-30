import React, { useContext } from 'react'
import PropsContext from '../../PropsContext'
import { RtcConsumer } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import styles from '../../Style'

function FullScreen(props) {
    const { styleProps } = useContext(PropsContext);
    const { localBtnStyles } = styleProps;
    const { fullScreen } = localBtnStyles || {};

    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <BtnTemplate
                            name={'fullscreen'}
                            style={{ ...styles.localBtn, ...fullScreen }}
                            onPress={() => { dispatch({ action: 'onFullScreen' }) }}
                        />
                    )
                )
            }
        </RtcConsumer>
    )
}

export default FullScreen;