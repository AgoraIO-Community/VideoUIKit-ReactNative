import React, {useState, useEffect, useContext, useRef, FC} from 'react';
import RtcEngine, {
  VideoEncoderConfiguration,
  AreaCode,
} from 'react-native-agora';
import {Platform} from 'react-native';
import requestCameraAndAudioPermission from '../Utils/permission';
import {DispatchType} from '../Contexts/RtcContext';
import PropsContext, {
  ToggleState,
  ClientRole,
  ChannelProfile,
} from '../Contexts/PropsContext';
import quality from '../Utils/quality';

const Create = ({
  dispatch,
  children,
}: {
  dispatch: DispatchType;
  children: (engine: React.MutableRefObject<RtcEngine>) => JSX.Element;
}) => {
  const [ready, setReady] = useState(false);
  const {callbacks, rtcProps, mode} = useContext(PropsContext);
  let engine = useRef<RtcEngine>({} as RtcEngine);

  useEffect(() => {
    async function init() {
      if (Platform.OS === 'android') {
        //Request required permissions from Android
        await requestCameraAndAudioPermission();
      }
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          engine.current = await RtcEngine.createWithAreaCode(
            rtcProps.appId,
            // eslint-disable-next-line no-bitwise
            AreaCode.GLOB ^ AreaCode.CN,
          );
        } else {
          engine.current = await RtcEngine.create(rtcProps.appId);
        }
        /* Live Streaming */
        if (mode == ChannelProfile.LiveBroadcasting) {
          await engine.current.setChannelProfile(
            ChannelProfile.LiveBroadcasting,
          );
          await engine.current.setClientRole(
            rtcProps.role === ClientRole.Audience
              ? ClientRole.Audience
              : ClientRole.Broadcaster,
          );
        } else {
          await engine.current.setChannelProfile(ChannelProfile.Communication);
        }
        if (rtcProps.profile) {
          if (Platform.OS === 'web') {
            // move this to bridge?
            // @ts-ignore
            await engine.current.setVideoProfile(rtcProps.profile);
          } else {
            const config: VideoEncoderConfiguration = quality[rtcProps.profile];
            await engine.current.setVideoEncoderConfiguration({
              ...config,
              bitrate: 0,
            });
          }
        }

        /**
         * API enableVideo :
         * On Web -> Asks permissions and then creates microphone and camera tracks
         * On Native -> Used to start the call in video module
         * The following condition allows enableVideo API to run in all the conditions
         * except when mode is livestreaming && user is attendee && running on web,
         * thereby not asking permissions and not creating tracks for attendees
         */
        if (
          !(
            mode === ChannelProfile.LiveBroadcasting &&
            rtcProps.role == ClientRole.Audience &&
            Platform.OS === 'web'
          )
        ) {
          try {
            await engine.current.enableVideo();
            isVideoEnabledRef.current = true;
          } catch (e) {
            dispatch({
              type: 'LocalMuteAudio',
              value: [ToggleState.disabled],
            });
            dispatch({
              type: 'LocalMuteVideo',
              value: [ToggleState.disabled],
            });
            console.error('No devices', e);
          }
        }

        engine.current.addListener(
          'JoinChannelSuccess',
          async (channel, uid, elapsed) => {
            //Invoke the callback
            console.log('UIkit enabling dual stream', rtcProps.dual);
            if (rtcProps.dual) {
              console.log('UIkit enabled dual stream');
              await engine.current!.enableDualStreamMode(rtcProps.dual);
              // await engine.current.setRemoteSubscribeFallbackOption(1);
            }
            callbacks?.JoinChannelSuccess &&
              callbacks.JoinChannelSuccess(channel, uid, elapsed);
          },
        );

        engine.current.addListener('UserJoined', (...args) => {
          //Get current peer IDs
          dispatch({
            type: 'UserJoined',
            value: args,
          });
        });

        engine.current.addListener('UserOffline', (...args) => {
          //If user leaves
          dispatch({
            type: 'UserOffline',
            value: args,
          });
        });

        engine.current.addListener('RemoteAudioStateChanged', (...args) => {
          dispatch({
            type: 'RemoteAudioStateChanged',
            value: args,
          });
        });

        engine.current.addListener('Error', (e) => {
          console.log('Error: ', e);
        });

        engine.current.addListener('RemoteVideoStateChanged', (...args) => {
          dispatch({
            type: 'RemoteVideoStateChanged',
            value: args,
          });
        });
        setReady(true);
      } catch (e) {
        console.error(e);
      }
    }
    init();
    return () => {
      engine.current!.destroy();
    };
  }, [rtcProps.appId]);

  return (
    <>
      {
        // Render children once RTCEngine has been initialized
        ready && engine ? children(engine) : <></>
      }
    </>
  );
};

export default Create;
