import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {ContentInterface} from '../Contexts/PropsContext';
import {View, ViewStyle} from 'react-native';
import useLocalUid from '../Utils/useLocalUid';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: ContentInterface;
  fallback?: React.ComponentType;
  containerStyle?: ViewStyle;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};
  const {containerStyle = {}} = props;
  const Fallback = props.fallback;
  const localUid = useLocalUid();
  const uid = props.user.uid === rtcProps?.screenShareUid ? 1 : props.user.uid;
  return uid === localUid ? (
    props.user.video ? (
      <LocalView
        style={{
          ...styles.fullView,
          ...(maxViewStyles as object),
          ...containerStyle,
        }}
        renderMode={VideoRenderMode.Fit}
      />
    ) : Fallback ? (
      <Fallback />
    ) : (
      <View style={[{flex: 1, backgroundColor: '#000'}, containerStyle]} />
    )
  ) : props.user.video ? (
    <RemoteView
      style={{
        ...styles.fullView,
        ...(maxViewStyles as object),
        ...containerStyle,
      }}
      uid={uid as number}
      renderMode={VideoRenderMode.Fit}
    />
  ) : Fallback ? (
    <Fallback />
  ) : (
    <View style={[{flex: 1, backgroundColor: '#000'}, containerStyle]} />
  );
};

export default MaxVideoView;
