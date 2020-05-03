import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView} from 'react-native-agora';
import styles from './Style';
import {Types} from 'react-native-agora';
import PropsContext from './PropsContext';
import {UidInterface} from './RtcContext';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;
const {VideoRenderMode} = Types;

interface MaxViewInterface {
  user: UidInterface;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};

  return props.user.uid === 'local' ? (
    <LocalView
      style={{...styles.fullView, ...(maxViewStyles as object)}}
      renderMode={VideoRenderMode.Hidden}
    />
  ) : (
    <>
      <RemoteView
        style={{...styles.fullView, ...(maxViewStyles as object)}}
        uid={props.user.uid as number}
        renderMode={VideoRenderMode.Hidden}
      />
    </>
  );
};

export default MaxVideoView;
