import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {RenderModeType, RtcSurfaceView} from 'react-native-agora';
import styles from '../Style';
import icons from '../Controls/Icons';
import RemoteControls from '../Controls/RemoteControls';
import PropsContext, {UidInterface} from '../Contexts/PropsContext';
import ImageIcon from '../Controls/ImageIcon';
import Username from './Usernames';
// import RtcContext from '../Contexts/RtcContext';

interface MinViewInterface {
  user: UidInterface;
  color?: string;
  showOverlay?: boolean;
  Fallback?: React.ComponentType;
}

const MinVideoView: React.FC<MinViewInterface> = (props) => {
  const [overlay, setOverlay] = useState(false);
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {theme, remoteBtnStyles, customIcon} = styleProps || {};
  const {minCloseBtnStyles} = remoteBtnStyles || {};
  const {showOverlay} = props || {};

  return (
    <View style={{margin: 5}}>
      {showOverlay ? (
        <TouchableOpacity onPress={() => setOverlay(true)}>
          <UserVideoWithFallback user={props.user} Fallback={props.Fallback} />
        </TouchableOpacity>
      ) : (
        <UserVideoWithFallback user={props.user} />
      )}

      {overlay && showOverlay ? (
        <View style={styles.minOverlay}>
          <TouchableOpacity
            style={{...styles.minCloseBtn, ...(minCloseBtnStyles as object)}}
            onPress={() => setOverlay(!overlay)}>
            <Image
              style={{
                width: 25,
                height: 25,
                tintColor: theme || props.color || '#fff',
              }}
              source={{
                uri: customIcon?.close ? customIcon.close : icons.close,
              }}
            />
          </TouchableOpacity>
          <RemoteControls showRemoteSwap={true} user={props.user} />
        </View>
      ) : (
        <></>
      )}
      {!rtcProps.disableRtm && <Username user={props.user} />}
    </View>
  );
};

const UserVideoWithFallback = (props: {
  user: UidInterface;
  Fallback?: React.ComponentType;
}) => {
  const {Fallback, user} = props;
  const {styleProps} = useContext(PropsContext);
  const {videoPlaceholderContainer, videoPlaceholderIcon} = styleProps || {};

  return user.video ? (
    <UserVideo user={user} />
  ) : Fallback ? (
    <Fallback />
  ) : (
    <View style={[styles.minViewFallback, videoPlaceholderContainer]}>
      <ImageIcon
        name={'videocamOff'}
        style={[styles.placeholderIcon, videoPlaceholderIcon]}
      />
    </View>
  );
};

const UserVideo = (props: {user: UidInterface}) => {
  const {styleProps} = useContext(PropsContext);
  // const {rtcUidRef} = useContext(RtcContext);
  const {minViewStyles} = styleProps || {};
  return props.user.uid === 'local' ? (
    <RtcSurfaceView
      style={{...styles.minView, ...(minViewStyles as object)}}
      canvas={{renderMode: RenderModeType.RenderModeFit, uid: 0}}
      zOrderMediaOverlay={true}
    />
  ) : (
    <RtcSurfaceView
      style={{...styles.minView, ...(minViewStyles as object)}}
      canvas={{
        renderMode: RenderModeType.RenderModeFit,
        uid: props.user.uid as number,
      }}
      zOrderMediaOverlay={true}
    />
  );
};

export default MinVideoView;
