import React, { useContext } from 'react'
import RtcContext from '../../RtcContext'
import RemoteBtnTemplate from './RemoteBtnTemplate'
import styles from '../../Style'

function RemoteSwap(props) {

    const { RtcEngine, dispatch } = useContext(RtcContext);

    return (
        <RemoteBtnTemplate
            name={'zoom-out-map'}
            style={(props.user.uid !== 'local') ? { ...styles.rightRemoteBtn, ...props.style } : {}}
            onPress={
                () => {
                    dispatch({ type: 'onSwapVideo', value: { user: props.user } });
                }
            }
        />
    )
}

export default RemoteSwap;
