import React, {useContext} from 'react';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {RenderInterface} from '../Contexts/PropsContext';
import {View, ViewStyle} from 'react-native';
import useLocalUid from '../Utils/useLocalUid';

const LocalView = RtcLocalView.SurfaceView;
const RemoteView = RtcRemoteView.SurfaceView;

interface MaxViewInterface {
  user: RenderInterface;
  fallback?: React.ComponentType;
  containerStyle?: ViewStyle;
  landscapeMode?: boolean;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {maxViewStyles} = styleProps || {};
  const Fallback = props.fallback;
  const {containerStyle = {}, landscapeMode = false} = props;
  const localUid = useLocalUid();
  const uid = props.user.uid === rtcProps?.screenShareUid ? 1 : props.user.uid;
  let landscapeModeStyle = {};
  if (landscapeMode) {
    landscapeModeStyle = {
      transform: 'rotate(90deg)',
      alignSelf: 'center',
      alignItems: 'center',
    };
  }
  return uid === localUid ? (
    props.user.video ? (
      <LocalView style={containerStyle} renderMode={VideoRenderMode.Fit} />
    ) : Fallback ? (
      <Fallback />
    ) : (
      <View style={[{flex: 1, backgroundColor: '#000'}, containerStyle]} />
    )
  ) : (
    <>
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: props.user.video ? 'flex' : 'none',
          ...landscapeModeStyle,
        }}>
        <RemoteView
          style={containerStyle}
          uid={uid as number}
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
            <View
              style={[{flex: 1, backgroundColor: '#000'}, containerStyle]}
            />
          )}
        </>
      )}
    </>
  );
};

export default MaxVideoView;
