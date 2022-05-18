import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import {View} from 'react-native';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: UidInterface;
  fallback?: React.ComponentType;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};
  const Fallback = props.fallback;

  return props.user.uid === 'local' ? (
    props.user.video ? (
      <LocalView
        style={{...styles.fullView, ...(maxViewStyles as object)}}
        renderMode={VideoRenderMode.Fit}
      />
    ) : Fallback ? (
      <Fallback />
    ) : (
      <View style={{flex: 1, backgroundColor: '#000'}} />
    )
  ) : (
    <>
      <div style={{flex: 1, display: props.user.video ? 'flex' : 'none'}}>
        <RemoteView
          style={{...styles.fullView, ...(maxViewStyles as object)}}
          uid={props.user.uid as number}
          renderMode={VideoRenderMode.Fit}
        />
      </div>
      {props.user.video ? (
        <></>
      ) : (
        <>
          {Fallback ? (
            <Fallback />
          ) : (
            <View style={{flex: 1, backgroundColor: '#000'}} />
          )}
        </>
      )}
    </>
  );
};

export default MaxVideoView;
