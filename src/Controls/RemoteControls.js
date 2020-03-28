import React, { useContext } from 'react'
import { View } from "react-native";
import RemoteAudioMute from './Remote/RemoteAudioMute'
import RemoteVideoMute from './Remote/RemoteVideoMute'
import RemoteSwap from './Remote/RemoteSwap'
import PropsContext from '../PropsContext'
import styles from '../Style'

function RemoteControls(props) {

    console.log('remote control', props);
    const { styleProps } = useContext(PropsContext);
    const { remoteBtnStyles } = styleProps;
    const { remoteBtnContainer } = remoteBtnStyles || {};

    return (
        <View style={{...styles.remoteBtnContainer, ...remoteBtnContainer}}>

            {(props.showMuteRemoteAudio !== false) ?
                <RemoteAudioMute
                    user={props.user} /> : <></>

            }
            {(props.showMuteRemoteVideo !== false) ?
                <RemoteVideoMute
                    user={props.user} /> : <></>
            }
            {(props.showRemoteSwap !== false) ?
                <RemoteSwap
                    user={props.user} /> : <></>
            }

        </View>
    )
}

export default RemoteControls;