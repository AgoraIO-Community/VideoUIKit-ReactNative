import React, { useContext } from 'react'
import { AgoraView } from 'react-native-agora'
import styles from './Style'
import { AgoraViewMode } from 'react-native-agora';
import PropsContext from './PropsContext'

function MaxVideoView(props) {
    const { styleProps } = useContext(PropsContext);
    const { maxViewStyles } = styleProps || {};

    return (
        (props.user.uid === 'local') ?
            <AgoraView
                style={{ ...styles.fullView, ...maxViewStyles }}
                showLocalVideo={true}
                mode={AgoraViewMode.HIDDEN}
            /> :
            <>
                <AgoraView
                    style={{ ...styles.fullView, ...maxViewStyles }}
                    remoteUid={props.user.uid}
                    mode={AgoraViewMode.HIDDEN}
                />

            </>
    )
}

export default MaxVideoView