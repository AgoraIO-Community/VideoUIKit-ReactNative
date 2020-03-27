import React, { useContext } from 'react'
import { View } from "react-native";
import RemoteAudioMute from './Remote/RemoteAudioMute'
import RemoteVideoMute from './Remote/RemoteVideoMute'
import RemoteSwap from './Remote/RemoteSwap'
import PropsContext from '../PropsContext'

function RemoteControls(props) {

    console.log('remote control', props);
    const { styleProps } = useContext(PropsContext);
    const { remoteBtnStyles } =  styleProps || {};
    // let muteRemoteAudio = {}, muteRemoteVideo = {}, remoteSwap = {};

    const { muteRemoteAudio, muteRemoteVideo, remoteSwap } = remoteBtnStyles || {};


    return (
        <View style={{
            width: '100%',
            display: 'flex',
            marginVertical: '25%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'center',
        }}>

            {(props.showMuteRemoteAudio !== false) ?
                <RemoteAudioMute
                    style={muteRemoteAudio}
                    user={props.user} /> : <></>

            }
            {(props.showMuteRemoteVideo !== false) ?
                <RemoteVideoMute
                    style={muteRemoteVideo}
                    user={props.user} /> : <></>
            }
            {(props.showRemoteSwap !== false) ?
                <RemoteSwap
                    style={remoteSwap}
                    user={props.user} /> : <></>
            }

        </View>
    )
}

export default RemoteControls;