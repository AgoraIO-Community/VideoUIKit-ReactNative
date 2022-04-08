import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import {View} from 'react-native';
import ImageIcon from '../Controls/ImageIcon';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: UidInterface;
  fallback?: React.ComponentType;
}
/**
 * MaxVideoView takes in a user and renders the video
 */
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
      <DefaultFallback />
    )
  ) : props.user.video ? (
    <RemoteView
      style={{...styles.fullView, ...(maxViewStyles as object)}}
      uid={props.user.uid as number}
      renderMode={VideoRenderMode.Fit}
    />
  ) : Fallback ? (
    <Fallback />
  ) : (
    <DefaultFallback />
  );
};

const DefaultFallback = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center'}}>
      <ImageIcon
        name={'videocamOff'}
        style={{width: 50, height: 50, alignSelf: 'center', opacity: 0.5}}
      />
    </View>
  );
};

export default MaxVideoView;
