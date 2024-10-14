import React, {useEffect, useContext, useRef, useState} from 'react';
import {IRtcEngine} from 'react-native-agora';
import {ContentStateInterface} from '../Contexts/RtcContext';
import {DispatchType} from '../Contexts/DispatchContext';
import PropsContext, {ToggleState} from '../Contexts/PropsContext';
import {Platform} from 'react-native';

const Join: React.FC<{
  children: React.ReactNode;
  precall: boolean;
  engineRef: React.MutableRefObject<IRtcEngine>;
  uidState: ContentStateInterface;
  dispatch: DispatchType;
  tracksReady: boolean;
  preventJoin?: boolean;
}> = ({children, precall, engineRef, uidState, dispatch, tracksReady}) => {
  const [joinState, setJoinState] = useState(false);
  const {rtcProps} = useContext(PropsContext);

  const audioRoom = rtcProps?.audioRoom || false;
  //commented for v1 release
  // const beforeJoin = rtcProps?.lifecycle?.useBeforeJoin
  //   ? rtcProps.lifecycle.useBeforeJoin()
  //   : null;

  useEffect(() => {
    if (joinState && tracksReady && Platform.OS === 'web') {
      //@ts-ignore
      engineRef.current.publish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracksReady, joinState]);

  useEffect(() => {
    if (rtcProps?.preventJoin) {
      return;
    }

    const engine = engineRef.current;
    async function leave() {
      try {
        console.log('Leaving channel');
        engine.leaveChannel();
        setJoinState(false);
      } catch (err) {
        console.error('Cannot leave the channel:', err);
      }
    }
    const {defaultContent, activeUids} = uidState;
    const [maxUid] = activeUids;
    const videoState = defaultContent[maxUid]?.video;
    async function join() {
      if (
        rtcProps?.encryption &&
        rtcProps?.encryption.key &&
        rtcProps.encryption.mode &&
        rtcProps.encryption.salt
      ) {
        try {
          await engine.enableEncryption(true, {
            encryptionKey: rtcProps?.encryption.key,
            encryptionMode: rtcProps?.encryption.mode,
            encryptionKdfSalt: rtcProps?.encryption.salt,
            datastreamEncryptionEnabled: true,
          });
        } catch (error) {
          console.warn('encryption error', error);
        }
      }
      if (
        !audioRoom &&
        videoState === ToggleState.enabled &&
        Platform.OS === 'ios'
      ) {
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
      //commented for v1 release
      // try {
      //   if (beforeJoin) {
      //     await beforeJoin();
      //   }
      // } catch (error) {
      //   console.error('FPE:Error on executing useBeforeJoin', error);
      // }
      try {
        await engine.joinChannel(
          rtcProps?.token || '',
          rtcProps?.channel || '',
          rtcProps?.uid || 0,
          {},
        );
      } catch (error) {
        console.error('RTC joinChannel error', error);
      }
      if (
        !audioRoom &&
        videoState === ToggleState.enabled &&
        Platform.OS === 'ios'
      ) {
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
        if (!joinState) {
          await join();
          setJoinState(true);
        } else {
          await leave();
          await join();
        }
        console.log('Attempted join: ', rtcProps?.channel);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    rtcProps?.channel,
    rtcProps?.uid,
    rtcProps?.token,
    precall,
    rtcProps?.encryption,
    rtcProps?.preventJoin,
  ]);

  return <>{children}</>;
};

export default Join;
