import React, {useContext} from 'react';
import {
  RenderModeType,
  RtcSurfaceView,
  RtcTextureView,
} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {ContentInterface} from '../Contexts/PropsContext';
import {View, ViewStyle, Platform, ViewProps, StyleSheet} from 'react-native';
import useLocalUid from '../Utils/useLocalUid';

const LocalView = RtcSurfaceView;
let RemoteView = RtcSurfaceView;

interface MaxViewInterface {
  user: ContentInterface;
  fallback?: React.ComponentType;
  containerStyle?: ViewStyle;
  landscapeMode?: boolean;
  isFullView?: boolean;
}

/* 
RenderModeType :
Fill: Stretches or zooms to fill the screen, might distort.
Fit: Fits the entire video without distortion, might have black bars.
Hidden: Fills the screen, might cut off parts of the video.
*/

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};
  const {
    containerStyle = {},
    landscapeMode = false,
    isFullView = false,
  } = props;
  let landscapeModeStyle: ViewProps['style'] = {};
  if (landscapeMode) {
    //SurfaceView does not support transform
    //TextureView only applicable to android
    if (Platform.OS === 'android') {
      RemoteView = RtcTextureView;
    }
    landscapeModeStyle = {
      flex: 1,
      alignSelf: 'center',
      alignItems: 'center',
      transform: [{rotate: '90deg'}],
    };
  }
  const Fallback = props.fallback;
  const localUid = useLocalUid();
  //@ts-ignore
  const uid = props.user.uid === rtcProps?.screenShareUid ? 1 : props.user.uid;
  return uid === localUid ? (
    props.user.video ? (
      <LocalView
        style={{
          ...styles.fullView,
          ...(maxViewStyles as object),
          ...containerStyle,
        }}
        canvas={{
          renderMode: isFullView
            ? RenderModeType.RenderModeAdaptive
            : RenderModeType.RenderModeFit,
          uid: 0,
        }}
      />
    ) : Fallback ? (
      <Fallback />
    ) : (
      <View style={[style.containerStyle, containerStyle]} />
    )
  ) : props.user.video ? (
    <RemoteView
      style={{
        ...styles.fullView,
        ...(maxViewStyles as object),
        ...containerStyle,
        ...landscapeModeStyle,
      }}
      canvas={{
        renderMode: RenderModeType.RenderModeFit,
        uid: uid as number,
      }}
    />
  ) : Fallback ? (
    <Fallback />
  ) : (
    <View style={[style.containerStyle, containerStyle]} />
  );
};

export default MaxVideoView;

const style = StyleSheet.create({
  containerStyle: {flex: 1, backgroundColor: '#000'},
});
