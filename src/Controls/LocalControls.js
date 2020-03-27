import React, { useContext } from 'react';
import { Icon } from 'react-native-elements';
import { View, Text } from 'react-native';
import styles from '../Style'
import EndCall from './Local/EndCall'
import LocalAudioMute from './Local/LocalAudioMute'
import LocalVideoMute from './Local/LocalVideoMute'
import SwitchCamera from './Local/SwitchCamera'
import FullScreen from './Local/FullScreen'
import RemoteControls from './RemoteControls'
import { MaxUidConsumer } from '../MaxUidContext'
import PropsContext from '../PropsContext'

function Controls(props) {

    const { styleProps } = useContext(PropsContext);
    const { localControlStyles } = styleProps || {};
    return (
        <>
            <View style={{ ...styles.Controls, ...localControlStyles }}>

                <LocalAudioMute />
                <LocalVideoMute />
                <EndCall />
                <SwitchCamera />
                <FullScreen />

            </View>
            <MaxUidConsumer>
                {
                    (users) => (
                        <View style={{ ...styles.Controls, bottom: styles.Controls.bottom + 70 }}>
                            <RemoteControls user={users[0]} showRemoteSwap={false} />
                        </View>
                    )
                }
            </MaxUidConsumer>

        </>
    )
}

export default Controls;