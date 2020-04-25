import React, { useContext } from 'react'
import PropsContext from '../../PropsContext'
import { RtcConsumer } from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import styles from '../../Style'

function SwitchCamera(props) {
    const { styleProps } = useContext(PropsContext);
    const { localBtnStyles } = styleProps || {};
    const { switchCamera } = localBtnStyles || {};

    return (
        <RtcConsumer>
            {
                (
                    ({ RtcEngine, dispatch }) => (
                        <BtnTemplate
                            name={'switchCamera'}
                            style={{ ...styles.localBtn, ...switchCamera }}
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