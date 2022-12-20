import React, {useContext} from 'react';
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
import styles from '../Style';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import {View} from 'react-native';
// import {RtcContext} from 'Contexts';

interface MaxViewInterface {
  user: UidInterface;
  fallback?: React.ComponentType;
}

const MaxVideoView: React.FC<MaxViewInterface> = (props) => {
  const {styleProps} = useContext(PropsContext);
  // const {rtcUidRef} = useContext(RtcContext);
  const {maxViewStyles} = styleProps || {};
  const Fallback = props.fallback;

  return props.user.uid === 'local' ? (
    props.user.video ? (
      <RtcSurfaceView
        style={{...styles.fullView, ...(maxViewStyles as object)}}
        canvas={{renderMode: RenderModeType.RenderModeFit, uid: 0}}
      />
    ) : Fallback ? (
      <Fallback />
    ) : (
      <View style={{flex: 1, backgroundColor: '#000'}} />
    )
  ) : (
    <>
      <div style={{flex: 1, display: props.user.video ? 'flex' : 'none'}}>
        <RtcSurfaceView
          style={{...styles.fullView, ...(maxViewStyles as object)}}
          canvas={{
            renderMode: RenderModeType.RenderModeFit,
            uid: props.user.uid as number,
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
            <View style={{flex: 1, backgroundColor: '#000'}} />
          )}
        </>
      )}
    </>
  );
};

export default MaxVideoView;
