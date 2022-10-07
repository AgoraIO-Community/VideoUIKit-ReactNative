import React, {useState, useEffect, useContext, useRef, FC} from 'react';
import RtcEngine, {
  VideoEncoderConfiguration,
  AreaCode,
  AudioProfile,
  AudioScenario,
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
  const {geoFencing = true, audioRoom = false} = rtcProps || {};
  let engine = useRef<RtcEngine>({} as RtcEngine);
  // commented for v1 release
  // const beforeCreate = rtcProps?.lifecycle?.useBeforeCreate
  //   ? rtcProps.lifecycle.useBeforeCreate()
  //   : null;
  const isVideoEnabledRef = useRef<boolean>(false);
  const firstUpdate = useRef(true);

  const enableVideoAndAudioWithDisabledState = async () => {
    try {
      if (audioRoom === true) {
        await engine.current.enableAudio();
        dispatch({
          type: 'LocalMuteAudio',
          value: [ToggleState.disabled],
        });
      } else {
        await engine.current.enableVideo();
        dispatch({
          type: 'LocalMuteAudio',
          value: [ToggleState.disabled],
        });
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.disabled],
        });
      }
    } catch (error) {
      const {status} = error as any;
      // App Builder web only
      if (status) {
        const {audioError, videoError} = status;

        if (!audioError) {
          dispatch({
            type: 'LocalMuteAudio',
            value: [ToggleState.disabled],
          });
        } else {
          console.error('No audio device', audioError);
        }

        if (!videoError && !audioRoom) {
          dispatch({
            type: 'LocalMuteVideo',
            value: [ToggleState.disabled],
          });
        } else {
          console.error('No video device', videoError);
        }
      }
      console.error('No devices', error);
    }
  };
  const enableVideoAndAudioWithEnabledState = async () => {
    try {
      if (audioRoom === true) {
        await engine.current.enableAudio();
        dispatch({
          type: 'LocalMuteAudio',
          value: [ToggleState.enabled],
        });
      } else {
        await engine.current.enableVideo();
        dispatch({
          type: 'LocalMuteAudio',
          value: [ToggleState.enabled],
        });
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.enabled],
        });
      }
    } catch (e) {
      const {status} = e as any;

      // App Builder web only
      if (status) {
        const {audioError, videoError} = status;

        if (!audioError) {
          dispatch({
            type: 'LocalMuteAudio',
            value: [ToggleState.enabled],
          });
        } else {
          console.error('No audio device', audioError);
        }

        if (!videoError && !audioRoom) {
          dispatch({
            type: 'LocalMuteVideo',
            value: [ToggleState.enabled],
          });
        } else {
          console.error('No video device', videoError);
        }
      }
      console.error('No devices', e);
    }
  };
  const enableVideoAndAudioWithInitialStates = async () => {
    if (
      mode == ChannelProfile.LiveBroadcasting &&
      rtcProps?.role == ClientRole.Audience
    ) {
      enableVideoAndAudioWithDisabledState();
    } else {
      enableVideoAndAudioWithEnabledState();
    }
  };

  useEffect(() => {
    async function init() {
      if (Platform.OS === 'android') {
        //Request required permissions from Android
        await requestCameraAndAudioPermission(audioRoom);
      }
      // commented for v1 release
      // try {
      //   if (beforeCreate) {
      //     await beforeCreate();
      //   }
      // } catch (error) {
      //   console.error('FPE:Error on executing useBeforeCreate', error);
      // }
      try {
        if (
          geoFencing === true &&
          (Platform.OS === 'android' || Platform.OS === 'ios')
        ) {
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
        if (!audioRoom) {
          if (rtcProps.profile) {
            if (Platform.OS === 'web') {
              // move this to bridge?
              // @ts-ignore
              await engine.current.setVideoProfile(rtcProps.profile);
            } else {
              const config: VideoEncoderConfiguration =
                quality[rtcProps.profile];
              await engine.current.setVideoEncoderConfiguration({
                ...config,
                bitrate: 0,
              });
            }
          }
        } else {
          //web will work even without audio profile
          //but native need to set audio profile otherwise user will experience low audio issue
          if (Platform.OS === 'android' || Platform.OS === 'ios') {
            await engine.current.setAudioProfile(
              AudioProfile.Default,
              AudioScenario.Default,
            );
            //also audio route for voice-chat will work through earpiece not phonespeaker
            //for audiolivecast it will work through phone speaker
            //ref - https://docs.agora.io/en/help/integration-issues/profile_difference/#audio-route
            //so setting into phone speaker manually as requested
            if (mode == ChannelProfile.Communication) {
              await engine.current.setEnableSpeakerphone(true);
            }
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
          await enableVideoAndAudioWithInitialStates();
          isVideoEnabledRef.current = true;
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
      /**
       * if condition add for websdk issue
       * For some reason even if engine.current is defined somehow destroy gets undefined and
       * causes a crash so thats why this check is needed before we call the method
       */
      if (engine.current.destroy) {
        engine.current!.destroy();
      }
    };
  }, [rtcProps.appId]);

  useEffect(() => {
    const toggleRole = async () => {
      if (mode == ChannelProfile.LiveBroadcasting) {
        if (rtcProps.role == ClientRole.Broadcaster) {
          await engine.current?.setClientRole(ClientRole.Broadcaster);
          // isVideoEnabledRef checks if the permission is already taken once
          if (!isVideoEnabledRef.current) {
            await enableVideoAndAudioWithDisabledState();
            isVideoEnabledRef.current = true;
          }
          if (isVideoEnabledRef.current) {
            // This unpublishes the current track
            await engine.current?.muteLocalAudioStream(true);
            if (!audioRoom) {
              await engine.current?.muteLocalVideoStream(true);
            }
            // This updates the uid interface
            dispatch({
              type: 'LocalMuteAudio',
              value: [ToggleState.disabled],
            });
            if (!audioRoom) {
              dispatch({
                type: 'LocalMuteVideo',
                value: [ToggleState.disabled],
              });
            }
          }
        }
        if (rtcProps.role == ClientRole.Audience) {
          /**
           * To switch the user role back to "audience", call unpublish first
           * Otherwise the setClientRole method call fails and throws an exception.
           */
          await engine.current?.muteLocalAudioStream(true);
          if (!audioRoom) {
            await engine.current?.muteLocalVideoStream(true);
          }
          dispatch({
            type: 'LocalMuteAudio',
            value: [ToggleState.disabled],
          });
          if (!audioRoom) {
            dispatch({
              type: 'LocalMuteVideo',
              value: [ToggleState.disabled],
            });
          }
          await engine.current?.setClientRole(ClientRole.Audience);
        }
      }
    };
    // The firstUpdateCurrent ref skips the render of this block for the first time
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    toggleRole();
  }, [rtcProps.role]);

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
