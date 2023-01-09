import React, {useEffect, useContext, PropsWithChildren} from 'react';
import {IRtcEngine, RtcConnection} from 'react-native-agora';
import {UidStateInterface, DispatchType} from '../Contexts/RtcContext';
import PropsContext, {ToggleState} from '../Contexts/PropsContext';
import {Platform} from 'react-native';

const Join: React.FC<
  PropsWithChildren<{
    precall: boolean;
    engineRef: React.MutableRefObject<IRtcEngine>;
    uidState: UidStateInterface;
    dispatch: DispatchType;
    joinState: React.MutableRefObject<boolean>;
  }>
> = ({children, precall, engineRef, uidState, dispatch, joinState}) => {
  // let joinState = useRef(false);
  const {rtcProps} = useContext(PropsContext);

  useEffect(() => {
    const engine = engineRef.current;
    async function leave() {
      try {
        console.log('Leaving RTC channel');
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
          encryptionKdfSalt: rtcProps.encryption.salt,
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
      const UID = rtcProps.uid || 0;
      if (rtcProps.tokenUrl) {
        fetch(
          `${rtcProps.tokenUrl}/rtc/${rtcProps.channel}/publisher/uid/${UID}`,
        )
          .then((response) => {
            response.json().then((data) => {
              engine.joinChannel(data.rtcToken, rtcProps.channel, UID, {});
            });
          })
          .catch(function (err) {
            console.log('Fetch Error', err);
          });
      } else {
        await engine.joinChannel(
          rtcProps.token ? rtcProps.token : '',
          rtcProps.channel,
          UID,
          {},
        );
      }
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
        console.log('Attempted rtc join: ', rtcProps.channel);
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
    rtcProps.channel,
    rtcProps.uid,
    rtcProps.token,
    precall,
    rtcProps.encryption,
  ]);

  useEffect(() => {
    const handleActive = (connection: RtcConnection, uid: number) => {
      console.log('speaker is ', uid);
      dispatch({type: 'ActiveSpeaker', value: [uid]});
    };
    let sub;
    if (rtcProps.activeSpeaker === true) {
      engineRef.current.enableAudioVolumeIndication(200, 3, false);
      sub = engineRef.current?.addListener('onActiveSpeaker', handleActive);
    } else {
      engineRef.current.enableAudioVolumeIndication(0, 3, false);
      if (sub) {
        engineRef.current?.removeListener('onActiveSpeaker', handleActive);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps.activeSpeaker]);

  return <>{children}</>;
};

export default Join;
