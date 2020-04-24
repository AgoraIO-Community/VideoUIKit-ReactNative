import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import BtnTemplate from '../BtnTemplate'
import styles from '../../Style'
import PropsContext from '../../PropsContext'

function RemoteSwap(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);
    const { styleProps } = useContext(PropsContext);
    const { remoteBtnStyles } = styleProps;
    const { remoteSwap } = remoteBtnStyles || {};

    return (
        <BtnTemplate
            name={'remoteSwap'}
            style={(props.user.uid !== 'local') ? { ...styles.rightRemoteBtn, ...remoteSwap } : {}}
            onPress={
                () => {
                    dispatch({ type: 'onSwapVideo', value: { user: props.user } });
                }
            }
        />
    )
}

export default RemoteSwap;
