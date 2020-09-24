import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import styles from './Style';
import icons from './Controls/Icons';
import RemoteControls from './Controls/RemoteControls';
import PropsContext from './PropsContext';
import {UidInterface} from './RtcContext';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MinViewInterface {
  user: UidInterface;
  color?: string;
  showOverlay?: boolean;
}

const MinVideoView: React.FC<MinViewInterface> = (props) => {
  const [overlay, setOverlay] = useState(false);
  const { styleProps } = useContext(PropsContext);
  const { minViewStyles, theme, remoteBtnStyles } = styleProps || {};
  const { minCloseBtnStyles } = remoteBtnStyles || {};
  const { showOverlay } = props || {};
  
  return (
    <View style={{ margin: 5 }}>
      {overlay && showOverlay ?
        <TouchableOpacity onPress={() => setOverlay(true)}>
          {props.user.uid === 'local' ? (
            props.user.video ? (
              <LocalView
                style={{ ...styles.minView, ...(minViewStyles as object) }}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
            ) : (
              <View style={{flex: 1, backgroundColor: '#000'}} />
            )
          ) : (
              <RemoteView
                style={{ ...styles.minView, ...(minViewStyles as object) }}
                uid={props.user.uid as number}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
            )}
        </TouchableOpacity>
        : props.user.uid === 'local' ? (
          <LocalView
            style={{ ...styles.minView, ...(minViewStyles as object) }}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        ) : (
            <RemoteView
              style={{ ...styles.minView, ...(minViewStyles as object) }}
              uid={props.user.uid as number}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          )}

      {overlay && showOverlay ? (
        <View style={styles.minOverlay}>
          <TouchableOpacity
            style={{ ...styles.minCloseBtn, ...(minCloseBtnStyles as object) }}
            onPress={() => setOverlay(!overlay)}>
            <Image
              style={{
                width: 25,
                height: 25,
                tintColor: theme || props.color || '#fff',
              }}
              source={{ uri: icons.close }}
            />
          </TouchableOpacity>
          <RemoteControls showRemoteSwap={true} user={props.user} />
        </View>
      ) : (
          <></>
        )}
    </View>
  );
};

export default MinVideoView;
