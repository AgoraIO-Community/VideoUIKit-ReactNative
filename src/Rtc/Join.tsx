import React, {useEffect, useContext, useRef} from 'react';
import RtcEngine from 'react-native-agora';
import {UidStateInterface, DispatchType} from '../Contexts/RtcContext';
import PropsContext, {ToggleState} from '../Contexts/PropsContext';
import {Platform} from 'react-native';

const Join: React.FC<{
  precall: boolean;
  engineRef: React.MutableRefObject<RtcEngine>;
  uidState: UidStateInterface;
  dispatch: DispatchType;
}> = ({children, precall, engineRef, uidState, dispatch}) => {
  let joinState = useRef(false);
  const {rtcProps} = useContext(PropsContext);

  useEffect(() => {
    const engine = engineRef.current;
    async function leave() {
      try {
        console.log('Leaving channel');
        engine.leaveChannel();
        joinState.current = false;
      } catch (err) {
        console.error('Cannot leave the channel:', err);
      }
    }
    const videoState = uidState.max[0].video;
    async function join() {
      if (
        rtcProps.encryption &&
        rtcProps.encryption.key &&
        rtcProps.encryption.mode
      ) {
        console.log('using channel encryption', rtcProps.encryption);
        await engine.enableEncryption(true, {
          encryptionKey: rtcProps.encryption.key,
          encryptionMode: rtcProps.encryption.mode,
        });
      }
      if (videoState === ToggleState.enabled && Platform.OS === 'ios') {
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.disabling],
        });
        await engine.muteLocalVideoStream(true);
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.disabled],
        });
      }
      await engine.joinChannel(
        rtcProps.token || null,
        rtcProps.channel,
        null,
        rtcProps.uid || 0,
      );
      if (videoState === ToggleState.enabled && Platform.OS === 'ios') {
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.enabling],
        });
        await engine.muteLocalVideoStream(false);
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.enabled],
        });
      }
    }
    async function init() {
      if (!precall) {
        if (!joinState.current) {
          await join();
          joinState.current = true;
        } else {
          await leave();
          await join();
        }
        console.log('Attempted join: ', rtcProps.channel);
      } else {
        console.log('In precall - waiting to join');
      }
    }
    init();
    return () => {
      if (!precall) {
        leave();
      }
    };
  }, [
    rtcProps.channel,
    rtcProps.uid,
    rtcProps.token,
    precall,
    rtcProps.encryption,
  ]);

  return <>{children}</>;
};

export default Join;
