import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {RtcLocalView, RtcRemoteView, Types} from 'react-native-agora';
import styles from './Style';
import icons from './Controls/Icons';
import RemoteControls from './Controls/RemoteControls';
import PropsContext from './PropsContext';
import {UidInterface} from './RtcContext';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;
const {VideoRenderMode} = Types;

interface MinViewInterface {
  user: UidInterface;
  color?: string;
}

const MinVideoView: React.FC<MinViewInterface> = (props) => {
  const [overlay, setOverlay] = useState(false);
  const {styleProps} = useContext(PropsContext);
  const {minViewStyles, theme, remoteBtnStyles} = styleProps || {};
  const {minCloseBtnStyles} = remoteBtnStyles || {};

  return (
    <View style={{margin: 5}}>
      <TouchableOpacity onPress={() => setOverlay(true)}>
        {props.user.uid === 'local' ? (
          <LocalView
            style={{...styles.minView, ...(minViewStyles as object)}}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        ) : (
          <RemoteView
            style={{...styles.minView, ...(minViewStyles as object)}}
            uid={props.user.uid as number}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
          />
        )}
      </TouchableOpacity>

      {overlay ? (
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
