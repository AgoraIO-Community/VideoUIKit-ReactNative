import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from './Style';
import PropsContext from './PropsContext';
import {UidInterface} from './RtcContext';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: UidInterface;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};

  return props.user.uid === 'local' ? (
    <LocalView
      style={{...styles.fullView, ...(maxViewStyles as object)}}
      renderMode={VideoRenderMode.Fit}
    />
  ) : (
    <>
      <RemoteView
        style={{...styles.fullView, ...(maxViewStyles as object)}}
        uid={props.user.uid as number}
        renderMode={VideoRenderMode.Fit}
      />
    </>
  );
};

export default MaxVideoView;
