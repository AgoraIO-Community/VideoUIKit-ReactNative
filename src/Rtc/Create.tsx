import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  createAgoraRtcEngine,
  VideoEncoderConfiguration,
  AreaCode,
  IRtcEngine,
  AudioProfileType,
  AudioScenarioType,
} from 'react-native-agora';
import {Platform} from 'react-native';
import requestCameraAndAudioPermission from '../Utils/permission';
import {DispatchType} from '../Contexts/DispatchContext';
import PropsContext, {
  ToggleState,
  ClientRoleType,
  ChannelProfileType,
  PermissionState,
} from '../Contexts/PropsContext';
import quality from '../Utils/quality';

const Create = ({
  dispatch,
  children,
}: {
  dispatch: DispatchType;
  children: (
    engine: React.MutableRefObject<IRtcEngine>,
    tracksReady: boolean,
  ) => React.ReactElement;
}) => {
  const mutexLock = useRef(false);
  const [ready, setReady] = useState(false);
  const [tracksReady, setTracksReady] = useState(false);
  const {callbacks, rtcProps, mode} = useContext(PropsContext);
  const {
    geoFencing = true,
    audioRoom = false,
    activeSpeaker = false,
  } = rtcProps || {};
  let engine = useRef<IRtcEngine>({} as IRtcEngine);
  // commented for v1 release
  // const beforeCreate = rtcProps?.lifecycle?.useBeforeCreate
  //   ? rtcProps.lifecycle.useBeforeCreate()
  //   : null;
  const isVideoEnabledRef = useRef<boolean>(false);
  const firstUpdate = useRef(true);

  const dispatchPermissionState = (audioError: any, videoError: any) => {
    if (audioError && videoError) {
      dispatch({
        type: 'LocalPermissionState',
        value: [PermissionState.REJECTED],
      });
    } else if (audioError && !videoError) {
      dispatch({
        type: 'LocalPermissionState',
        value: [PermissionState.GRANTED_FOR_CAM_ONLY],
      });
    } else if (!audioError && videoError) {
      dispatch({
        type: 'LocalPermissionState',
        value: [PermissionState.GRANTED_FOR_MIC_ONLY],
      });
    } else {
      dispatch({
        type: 'LocalPermissionState',
        value: [PermissionState.GRANTED_FOR_CAM_AND_MIC],
      });
    }
  };

  const enableVideoAndAudioWithDisabledState = async () => {
    try {
      dispatch({
        type: 'LocalPermissionState',
        value: [PermissionState.REQUESTED],
      });
      if (audioRoom === true) {
        await engine.current.enableAudio();
        dispatch({
          type: 'LocalPermissionState',
          value: [PermissionState.GRANTED_FOR_MIC_ONLY],
        });
        dispatch({
          type: 'LocalMuteAudio',
          value: [ToggleState.disabled],
        });
      } else {
        await engine.current.enableVideo();
        dispatch({
          type: 'LocalPermissionState',
          value: [PermissionState.GRANTED_FOR_CAM_AND_MIC],
        });
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
        dispatchPermissionState(audioError, videoError);
      }
      console.error('No devices', error);
    }
  };
  const enableVideoAndAudioWithEnabledState = async () => {
    try {
      dispatch({
        type: 'LocalPermissionState',
        value: [PermissionState.REQUESTED],
      });
      if (audioRoom === true) {
        await engine.current.enableAudio();
        dispatch({
          type: 'LocalPermissionState',
          value: [PermissionState.GRANTED_FOR_MIC_ONLY],
        });
        dispatch({
          type: 'LocalMuteAudio',
          value: [ToggleState.enabled],
        });
      } else {
        await engine.current.enableVideo();
        dispatch({
          type: 'LocalPermissionState',
          value: [PermissionState.GRANTED_FOR_CAM_AND_MIC],
        });
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
        dispatchPermissionState(audioError, videoError);
      }
      console.error('No devices', e);
    }
  };
  const enableVideoAndAudioWithInitialStates = async () => {
    if (
      mode === ChannelProfileType.ChannelProfileLiveBroadcasting &&
      rtcProps?.role === ClientRoleType.ClientRoleAudience
    ) {
      enableVideoAndAudioWithDisabledState();
    } else {
      enableVideoAndAudioWithEnabledState();
    }
  };

  useEffect(() => {
    async function init() {
      mutexLock.current = true;
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
        engine.current = createAgoraRtcEngine();
        if (
          geoFencing === true &&
          (Platform.OS === 'android' || Platform.OS === 'ios')
        ) {
          if (rtcProps?.appId) {
            engine.current.initialize({
              appId: rtcProps.appId,
              // eslint-disable-next-line no-bitwise
              areaCode: AreaCode.AreaCodeGlob ^ AreaCode.AreaCodeCn,
            });
          }
        } else {
          if (rtcProps?.appId) {
            engine.current.initialize({appId: rtcProps.appId});
          }
        }
        /* Live Streaming */
        if (mode === ChannelProfileType.ChannelProfileLiveBroadcasting) {
          await engine.current.setChannelProfile(
            ChannelProfileType.ChannelProfileLiveBroadcasting,
          );
          await engine.current.setClientRole(
            rtcProps?.role === ClientRoleType.ClientRoleAudience
              ? ClientRoleType.ClientRoleAudience
              : ClientRoleType.ClientRoleBroadcaster,
          );
        } else {
          await engine.current.setChannelProfile(
            ChannelProfileType.ChannelProfileCommunication,
          );
        }
        if (activeSpeaker) {
          await engine.current.enableAudioVolumeIndication(100, 3, true);
        }
        if (!audioRoom) {
          if (rtcProps && rtcProps.profile) {
            if (Platform.OS === 'web') {
              // move this to bridge?
              // @ts-ignore
              await engine.current.setVideoProfile(rtcProps.profile);
            } else {
              if (rtcProps && rtcProps?.profile) {
                const config: VideoEncoderConfiguration =
                  quality[rtcProps.profile];
                //@ts-ignore
                await engine.current.setVideoEncoderConfiguration({
                  ...config,
                  bitrate: 0,
                });
              }
            }
          }
        } else {
          //web will work even without audio profile
          //but native need to set audio profile otherwise user will experience low audio issue
          if (Platform.OS === 'android' || Platform.OS === 'ios') {
            //@ts-ignore
            await engine.current.setAudioProfile(
              AudioProfileType.AudioProfileDefault,
              AudioScenarioType.AudioScenarioDefault,
            );
            //also audio route for voice-chat will work through earpiece not phonespeaker
            //for audiolivecast it will work through phone speaker
            //ref - https://docs.agora.io/en/help/integration-issues/profile_difference/#audio-route
            //so setting into phone speaker manually as requested
            if (mode === ChannelProfileType.ChannelProfileCommunication) {
              //@ts-ignore
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
            mode === ChannelProfileType.ChannelProfileLiveBroadcasting &&
            rtcProps?.role === ClientRoleType.ClientRoleAudience &&
            Platform.OS === 'web'
          )
        ) {
          enableVideoAndAudioWithInitialStates().then(() => {
            setTracksReady(true);
            isVideoEnabledRef.current = true;
          });
        }

        engine.current.addListener(
          'onJoinChannelSuccess',
          async (connection, elapsed) => {
            //Invoke the callback
            console.log('UIkit enabling dual stream', rtcProps?.dual);
            if (rtcProps?.dual) {
              console.log('UIkit enabled dual stream');
              await engine.current!.enableDualStreamMode(rtcProps.dual);
              // await engine.current.setRemoteSubscribeFallbackOption(1);
            }
            callbacks?.JoinChannelSuccess &&
              callbacks.JoinChannelSuccess(connection, elapsed);
          },
        );

        engine.current.addListener('onUserJoined', async (...args) => {
          // preventing STT pusher bot in renderlist
          //@ts-ignore
          if (args[0] === 111111) {
            return;
          }
          //Get current peer IDs
          dispatch({
            type: 'UserJoined',
            //@ts-ignore
            value: args,
          });
        });

        engine.current.addListener('onUserOffline', (...args) => {
          //If user leaves
          dispatch({
            type: 'UserOffline',
            //@ts-ignore
            value: args,
          });
        });

        engine.current.addListener('onRemoteAudioStateChanged', (...args) => {
          dispatch({
            type: 'RemoteAudioStateChanged',
            //@ts-ignore
            value: args,
          });
        });

        engine.current.addListener('onError', (e) => {
          console.log('Error: ', e);
        });

        engine.current.addListener('onRemoteVideoStateChanged', (...args) => {
          dispatch({
            type: 'RemoteVideoStateChanged',
            //@ts-ignore
            value: args,
          });
        });

        setReady(true);
      } catch (e) {
        console.error(e);
      }
      mutexLock.current = false;
    }
    if (!mutexLock.current) {
      init();
    }
    return () => {
      /**
       * if condition add for websdk issue
       * For some reason even if engine.current is defined somehow destroy gets undefined and
       * causes a crash so thats why this check is needed before we call the method
       */
      //TODO: check with Hari if below req ?
      // if (engine.current.destroy) {
      //   engine.current!.destroy();
      // }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps?.appId, rtcProps?.uid]);

  useEffect(() => {
    const toggleRole = async () => {
      if (
        mode === ChannelProfileType.ChannelProfileLiveBroadcasting &&
        engine.current.setClientRole // Check if engine initialized
      ) {
        if (rtcProps?.role === ClientRoleType.ClientRoleBroadcaster) {
          await engine.current?.setClientRole(
            ClientRoleType.ClientRoleBroadcaster,
          );
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
        if (rtcProps?.role === ClientRoleType.ClientRoleAudience) {
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
          await engine.current?.setClientRole(
            ClientRoleType.ClientRoleAudience,
          );
        }
      }
    };
    // The firstUpdateCurrent ref skips the render of this block for the first time
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    toggleRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps?.role]);

  return (
    <>
      {
        // Render children once RTCEngine has been initialized
        ready && engine ? children(engine, tracksReady) : <></>
      }
    </>
  );
};

export default Create;
