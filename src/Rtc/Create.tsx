import React, {useState, useEffect, useContext, useRef, FC} from 'react';
import RtcEngine, {
  VideoEncoderConfiguration,
  AreaCode,
} from 'react-native-agora';
import {Platform} from 'react-native';
import requestCameraAndAudioPermission from '../Utils/permission';
import {DispatchType} from '../Contexts/RtcContext';
import PropsContext, {mode, role, ToggleState} from '../Contexts/PropsContext';
import quality from '../Utils/quality';

const Create = ({
  dispatch,
  children,
}: {
  dispatch: DispatchType;
  children: (engine: React.MutableRefObject<RtcEngine>) => JSX.Element;
}) => {
  const [ready, setReady] = useState(false);
  const {callbacks, rtcProps} = useContext(PropsContext);
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
          engine.current = await RtcEngine.create(
            rtcProps.appId,
            rtcProps.role,
          );
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
        try {
          if (rtcProps.mode === mode.Live) {
            if (rtcProps.role === role.Host) {
              await engine.current.enableVideo();
            }
          } else {
            await engine.current.enableVideo();
          }
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
  }, []);
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
