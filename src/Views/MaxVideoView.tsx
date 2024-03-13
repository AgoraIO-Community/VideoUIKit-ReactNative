import React, {useContext} from 'react';

import {RenderModeType, RtcSurfaceView} from 'react-native-agora';

import PropsContext, {ContentInterface} from '../Contexts/PropsContext';
import {View, ViewStyle, StyleSheet} from 'react-native';
import useLocalUid from '../Utils/useLocalUid';

const LocalView = RtcSurfaceView;
const RemoteView = RtcSurfaceView;

interface MaxViewInterface {
  user: ContentInterface;
  fallback?: React.ComponentType;
  containerStyle?: ViewStyle;
  landscapeMode?: boolean;
  isFullView?: boolean;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {rtcProps} = useContext(PropsContext);

  const Fallback = props.fallback;
  const {
    containerStyle = {},
    landscapeMode = false,
    isFullView = false,
  } = props;
  const localUid = useLocalUid();
  //@ts-ignore
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
      <LocalView
        style={containerStyle}
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
  ) : (
    <>
      <div
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          overflow: 'hidden',
          display: props.user.video ? 'flex' : 'none',
          ...landscapeModeStyle,
        }}>
        <RemoteView
          style={containerStyle}
          canvas={{
            renderMode: RenderModeType.RenderModeFit,
            uid: uid as number,
          }}
        />
      </div>
      {props.user.video ? (
        <></>
      ) : (
        <>
          {Fallback ? (
            <Fallback />
          ) : (
            <View style={[style.containerStyle, containerStyle]} />
          )}
        </>
      )}
    </>
  );
};

export default MaxVideoView;

const style = StyleSheet.create({
  containerStyle: {flex: 1, backgroundColor: '#000'},
});
