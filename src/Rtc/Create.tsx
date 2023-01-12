import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  createAgoraRtcEngine,
  VideoEncoderConfiguration,
  AreaCode,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora';
import {Platform} from 'react-native';
import requestCameraAndAudioPermission from '../Utils/permission';
import {DispatchType} from '../Contexts/RtcContext';
import PropsContext, {ToggleState} from '../Contexts/PropsContext';
import quality from '../Utils/quality';

const Create: React.FC<{
  dispatch: DispatchType;
  rtcUidRef: React.MutableRefObject<number | undefined>;
  setRtcChannelJoined: React.Dispatch<React.SetStateAction<boolean>>;
  children: (
    engine: React.MutableRefObject<IRtcEngine>,
    joinState: any,
  ) => React.ReactElement;
}> = ({dispatch, rtcUidRef, setRtcChannelJoined, children}) => {
  const [ready, setReady] = useState(false);
  const {callbacks, rtcProps} = useContext(PropsContext);
  let engine = useRef<IRtcEngine>({} as IRtcEngine);
  const isVideoEnabledRef = useRef<boolean>(false);
  const joinState = useRef<boolean>(false);
  const firstUpdate = useRef(true);

  useEffect(() => {
    // using == instead of === for web compatibility: strings vs. numbers in the enum
    async function init() {
      if (Platform.OS === 'android') {
        //Request required permissions from Android
        await requestCameraAndAudioPermission();
      }
      try {
        console.log('hello');
        engine.current = createAgoraRtcEngine();
        console.log('hello2');
        console.log(engine.current);
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          engine.current.initialize({
            appId: rtcProps.appId,
            // eslint-disable-next-line no-bitwise
            areaCode: AreaCode.AreaCodeGlob ^ AreaCode.AreaCodeCn,
          });
          // eslint-disable-next-line quotes, prettier/prettier
          engine.current.setParameters("{\"rtc.using_ui_kit\": 1}");
        } else {
          engine.current.initialize({appId: rtcProps.appId});
          // eslint-disable-next-line quotes, prettier/prettier
          engine.current.setParameters("{\"rtc.using_ui_kit\": 1}");
        }
        /* Live Streaming */
        if (
          // eslint-disable-next-line eqeqeq
          rtcProps.mode == ChannelProfileType.ChannelProfileLiveBroadcasting
        ) {
          await engine.current.setChannelProfile(
            ChannelProfileType.ChannelProfileLiveBroadcasting,
          );
          await engine.current.setClientRole(
            rtcProps.role === ClientRoleType.ClientRoleAudience
              ? ClientRoleType.ClientRoleAudience
              : ClientRoleType.ClientRoleBroadcaster,
          );
        } else {
          await engine.current.setChannelProfile(
            ChannelProfileType.ChannelProfileCommunication,
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
            rtcProps.mode ===
              ChannelProfileType.ChannelProfileLiveBroadcasting &&
            // eslint-disable-next-line eqeqeq
            rtcProps.role == ClientRoleType.ClientRoleAudience &&
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
          'onJoinChannelSuccess',
          async (connection, elapsed) => {
            rtcUidRef.current = connection.localUid;
            setRtcChannelJoined(true);
            //Invoke the callback
            console.log('UIkit enabling dual stream', rtcProps.dual);
            if (rtcProps.dual) {
              console.log('UIkit enabled dual stream');
              await engine.current!.enableDualStreamMode(rtcProps.dual);
              // await engine.current.setRemoteSubscribeFallbackOption(1);
            }
            rtcUidRef.current = connection.localUid;
            callbacks?.JoinChannelSuccess &&
              callbacks.JoinChannelSuccess(connection, elapsed);
          },
        );

        engine.current.addListener('onLeaveChannel', async () => {
          console.log('leave rtc channel');
          setRtcChannelJoined(false);
        });

        engine.current.addListener('onUserJoined', (...args) => {
          //Get current peer IDs
          dispatch({
            type: 'UserJoined',
            value: args,
          });
        });

        engine.current.addListener('onUserOffline', (...args) => {
          //If user leaves
          dispatch({
            type: 'UserOffline',
            value: args,
          });
        });

        engine.current.addListener('onRemoteAudioStateChanged', (...args) => {
          dispatch({
            type: 'RemoteAudioStateChanged',
            value: args,
          });
        });

        engine.current.addListener('onError', (e) => {
          console.log('Error: ', e);
        });

        if (rtcProps.tokenUrl) {
          engine.current.addListener(
            'onTokenPrivilegeWillExpire',
            (...args) => {
              const UID = rtcProps.uid || 0;
              console.log('TokenPrivilegeWillExpire: ', args, UID);
              fetch(
                `${rtcProps.tokenUrl}/rtc/${rtcProps.channel}/publisher/uid/${UID}`,
              )
                .then((response) => {
                  response.json().then((data) => {
                    engine.current?.renewToken(data.rtcToken);
                  });
                })
                .catch(function (err) {
                  console.log('Fetch Error', err);
                });
            },
          );
        }

        engine.current.addListener('onRemoteVideoStateChanged', (...args) => {
          dispatch({
            type: 'RemoteVideoStateChanged',
            value: args,
          });
        });
        setReady(true);
      } catch (e) {
        console.error('init erorr', e);
      }
    }
    init();
    const isJoinedRefValue = joinState.current;
    return () => {
      try {
        engine.current.removeAllListeners('onJoinChannelSuccess');
        engine.current.removeAllListeners('onLeaveChannel');
        engine.current.removeAllListeners('onUserJoined');
        engine.current.removeAllListeners('onUserOffline');
        engine.current.removeAllListeners('onRemoteVideoStateChanged');
        engine.current.removeAllListeners('onTokenPrivilegeWillExpire');
        engine.current.removeAllListeners('onRemoteAudioStateChanged');
        engine.current.removeAllListeners('onError');
        if (isJoinedRefValue) {
          engine.current.release();
        }
      } catch (e) {
        console.log('release error', e);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps.appId]);

  useEffect(() => {
    const toggleRole = async () => {
      // eslint-disable-next-line eqeqeq
      if (rtcProps.mode == ChannelProfileType.ChannelProfileLiveBroadcasting) {
        // eslint-disable-next-line eqeqeq
        if (rtcProps.role == ClientRoleType.ClientRoleBroadcaster) {
          await engine.current?.setClientRole(
            ClientRoleType.ClientRoleBroadcaster,
          );
          // isVideoEnabledRef checks if the permission is already taken once
          if (!isVideoEnabledRef.current) {
            try {
              // This creates local audio and video track
              await engine.current?.enableVideo();
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
            // fix -> add prop to make this auto publish after toggleRole
            if (rtcProps.enableMediaOnHost === false) {
              // This unpublishes the current track
              await engine.current?.muteLocalAudioStream(true);
              await engine.current?.muteLocalVideoStream(true);
              // This updates the uid interface
              dispatch({
                type: 'LocalMuteAudio',
                value: [ToggleState.disabled],
              });
              dispatch({
                type: 'LocalMuteVideo',
                value: [ToggleState.disabled],
              });
            } else {
              await engine.current?.muteLocalAudioStream(false);
              await engine.current?.muteLocalVideoStream(false);
              dispatch({
                type: 'LocalMuteAudio',
                value: [ToggleState.enabled],
              });
              dispatch({
                type: 'LocalMuteVideo',
                value: [ToggleState.enabled],
              });
            }
          }
        }
        // eslint-disable-next-line eqeqeq
        if (rtcProps.role == ClientRoleType.ClientRoleAudience) {
          dispatch({type: 'BecomeAudience', value: []});
          /**
           * To switch the user role back to "audience", call unpublish first
           * Otherwise the setClientRole method call fails and throws an exception.
           */
          await engine.current?.muteLocalAudioStream(true);
          await engine.current?.muteLocalVideoStream(true);
          dispatch({
            type: 'LocalMuteAudio',
            value: [ToggleState.disabled],
          });
          dispatch({
            type: 'LocalMuteVideo',
            value: [ToggleState.disabled],
          });
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
  }, [rtcProps.role]);

  return (
    <>
      {
        // Render children once RTCEngine has been initialized
        ready && engine ? children(engine, joinState) : <></>
      }
    </>
  );
};

export default Create;
