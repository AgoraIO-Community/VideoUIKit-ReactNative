import React, {useEffect, useContext, useRef} from 'react';
import RtcEngine from 'react-native-agora';
import {UidStateInterface, DispatchType} from '../Contexts/RtcContext';
import PropsContext, {
  ToggleState,
  ClientRole,
  ChannelProfile,
} from '../Contexts/PropsContext';
import {Platform} from 'react-native';

const Join: React.FC<{
  precall: boolean;
  engineRef: React.MutableRefObject<RtcEngine>;
  uidState: UidStateInterface;
  dispatch: DispatchType;
}> = ({children, precall, engineRef, uidState, dispatch}) => {
  let joinState = useRef(false);
  const {rtcProps, mode} = useContext(PropsContext);
  const isVideoEnabledRef = useRef<boolean>(false);

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

  useEffect(() => {
    const toggleRole = async () => {
      if (mode == ChannelProfile.LiveBroadcasting) {
        if (rtcProps.role == ClientRole.Broadcaster) {
          await engineRef.current?.setClientRole(ClientRole.Broadcaster);
          // isVideoEnabledRef checks if the permission is already taken once
          if (!isVideoEnabledRef.current) {
            try {
              // This creates local audio and video track
              await engineRef.current?.enableVideo();
              isVideoEnabledRef.current = true;
            } catch (error) {
              dispatch({
                type: 'LocalMuteAudio',
                value: [ToggleState.disabled],
              });
              dispatch({
                type: 'LocalMuteVideo',
                value: [ToggleState.disabled],
              });
            }
          }
          if (isVideoEnabledRef.current) {
            // This unpublishes the current track
            await engineRef.current?.muteLocalAudioStream(true);
            await engineRef.current?.muteLocalVideoStream(true);
            // This updates the uid interface
            dispatch({
              type: 'LocalMuteAudio',
              value: [ToggleState.disabled],
            });
            dispatch({
              type: 'LocalMuteVideo',
              value: [ToggleState.disabled],
            });
          }
        }
        if (rtcProps.role == ClientRole.Audience) {
          /**
           * To switch the user role back to "audience", call unpublish first
           * Otherwise the setClientRole method call fails and throws an exception.
           */
          await engineRef.current?.muteLocalAudioStream(true);
          await engineRef.current?.muteLocalVideoStream(true);
          dispatch({
            type: 'LocalMuteAudio',
            value: [ToggleState.disabled],
          });
          dispatch({
            type: 'LocalMuteVideo',
            value: [ToggleState.disabled],
          });
          await engineRef.current?.setClientRole(ClientRole.Audience);
        }
      }
    };
    if (joinState.current) {
      toggleRole();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps.role]);

  return <>{children}</>;
};

export default Join;
