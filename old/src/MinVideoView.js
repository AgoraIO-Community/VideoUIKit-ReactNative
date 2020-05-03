import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native'
import { AgoraView } from 'react-native-agora';
import styles from './Style'
import icons from './Controls/Icons'
import RemoteControls from './Controls/RemoteControls'
import { AgoraViewMode } from 'react-native-agora';
import PropsContext from './PropsContext'

function MinVideoView(props) {

    const [overlay, setOverlay] = useState(false);
    const { styleProps } = useContext(PropsContext);
    const { minViewStyles, theme } = styleProps || {};
    const { minCloseBtnStyles } = styleProps || {};

    return (
        <View style={{ margin: 5 }}>

            <TouchableOpacity
                onPress={() => setOverlay(true)}
            >
                {
                    (props.user.uid === 'local') ?
                        <AgoraView style={{ ...styles.minView, ...minViewStyles }} showLocalVideo={true} mode={AgoraViewMode.HIDDEN} zOrderMediaOverlay={true} /> :
                        <AgoraView style={{ ...styles.minView, ...minViewStyles }} remoteUid={props.user.uid} mode={AgoraViewMode.HIDDEN} zOrderMediaOverlay={true} />

                }
            </TouchableOpacity>

            {
                overlay ?
                    <View style={styles.minOverlay}>

                        <TouchableOpacity
                            style={{...styles.minCloseBtn, ...minCloseBtnStyles}}
                            onPress={() => setOverlay(!overlay)}
                        >
                            <Image style={{width: 25, height: 25}} source={{uri: icons['close'], isStatic: true}} tintColor={theme || props.color || "#fff"} />
                        </TouchableOpacity>

                        <RemoteControls showRemoteSwap={true} user={props.user} {...props.remoteControlProps} />

                    </View> : <></>
            }

        </View>
    )
}

export default MinVideoView;