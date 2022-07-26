import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from '../Style';
import icons from '../Controls/Icons';
import RemoteControls from '../Controls/RemoteControls';
import PropsContext, {RenderInterface} from '../Contexts/PropsContext';
import useLocalUid from '../Utils/useLocalUid';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MinViewInterface {
  user: RenderInterface;
  color?: string;
  showOverlay?: boolean;
}

const MinVideoView: React.FC<MinViewInterface> = (props) => {
  const [overlay, setOverlay] = useState(false);
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {minViewStyles, theme, remoteBtnStyles} = styleProps || {};
  const {minCloseBtnStyles} = remoteBtnStyles || {};
  const {showOverlay} = props || {};
  const localUid = useLocalUid();
  const uid = props.user.uid === rtcProps?.screenShareUid ? 1 : props.user.uid;
  return (
    <View style={{margin: 5}}>
      {showOverlay ? (
        <TouchableOpacity onPress={() => setOverlay(true)}>
          {uid === localUid ? (
            props.user.video ? (
              <LocalView
                style={{...styles.minView, ...(minViewStyles as object)}}
                renderMode={VideoRenderMode.Hidden}
                zOrderMediaOverlay={true}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#f0f',
                  ...styles.minView,
                  ...(minViewStyles as object),
                }}
              />
            )
          ) : (
            <RemoteView
              style={{...styles.minView, ...(minViewStyles as object)}}
              uid={uid as number}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          )}
        </TouchableOpacity>
      ) : uid === localUid ? (
        <LocalView
          style={{...styles.minView, ...(minViewStyles as object)}}
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay={true}
        />
      ) : (
        <RemoteView
          style={{...styles.minView, ...(minViewStyles as object)}}
          uid={uid as number}
          renderMode={VideoRenderMode.Hidden}
          zOrderMediaOverlay={true}
        />
      )}

      {overlay && showOverlay ? (
        <View style={styles.minOverlay}>
          <TouchableOpacity
            style={{...styles.minCloseBtn, ...(minCloseBtnStyles as object)}}
            onPress={() => setOverlay(!overlay)}>
            <Image
              style={{
                width: 25,
                height: 25,
                tintColor: theme || props.color || '#fff',
              }}
              source={{uri: icons.close}}
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
