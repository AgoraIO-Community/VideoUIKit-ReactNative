import React, { useContext } from 'react';
import { View } from "react-native";
import PropsContext from '../PropsContext';
import styles from '../Style';
import RemoteAudioMute from './Remote/RemoteAudioMute';
import RemoteSwap from './Remote/RemoteSwap';
import RemoteVideoMute from './Remote/RemoteVideoMute';

function RemoteControls(props) {

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
                <RemoteVideoMute rightButton={!props.showRemoteSwap}
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