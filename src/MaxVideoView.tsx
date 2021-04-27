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
  const {maxViewStyles, videoMode} = styleProps || {};
  const renderModeProp = videoMode?.max;

  return props.user.uid === 'local' ? (
    <LocalView
      style={{...styles.fullView, ...(maxViewStyles as object)}}
      renderMode={renderModeProp ? renderModeProp : VideoRenderMode.Fit}
    />
  ) : (
    <>
      <RemoteView
        style={{...styles.fullView, ...(maxViewStyles as object)}}
        uid={props.user.uid as number}
        renderMode={renderModeProp ? renderModeProp : VideoRenderMode.Fit}
      />
    </>
  );
};

export default MaxVideoView;
