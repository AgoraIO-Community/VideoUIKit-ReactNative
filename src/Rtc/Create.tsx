import React, {useState, useEffect, useContext, useRef} from 'react';
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

const Create: React.FC<{
  dispatch: DispatchType;
  rtcUidRef: React.MutableRefObject<number | undefined>;
  setRtcChannelJoined: React.Dispatch<React.SetStateAction<boolean>>;
  children: (engine: React.MutableRefObject<RtcEngine>) => React.ReactElement;
}> = ({dispatch, rtcUidRef, setRtcChannelJoined, children}) => {
  const [ready, setReady] = useState(false);
  const {callbacks, rtcProps} = useContext(PropsContext);
  let engine = useRef<RtcEngine>({} as RtcEngine);
  const isVideoEnabledRef = useRef<boolean>(false);
  const firstUpdate = useRef(true);

  useEffect(() => {
    // using == instead of === for web compatibility: strings vs. numbers in the enum
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
        if (rtcProps.mode == ChannelProfile.LiveBroadcasting) {
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
            rtcProps.mode === ChannelProfile.LiveBroadcasting &&
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
            rtcUidRef.current = uid;
            setRtcChannelJoined(true);
            //Invoke the callback
            console.log('UIkit enabling dual stream', rtcProps.dual);
            if (rtcProps.dual) {
              console.log('UIkit enabled dual stream');
              await engine.current!.enableDualStreamMode(rtcProps.dual);
              // await engine.current.setRemoteSubscribeFallbackOption(1);
            }
            rtcUidRef.current = uid;
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

        if (rtcProps.tokenUrl) {
          engine.current.addListener('TokenPrivilegeWillExpire', (...args) => {
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
          });
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps.appId]);

  useEffect(() => {
    const toggleRole = async () => {
      if (rtcProps.mode == ChannelProfile.LiveBroadcasting) {
        if (rtcProps.role == ClientRole.Broadcaster) {
          await engine.current?.setClientRole(ClientRole.Broadcaster);
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
        if (rtcProps.role == ClientRole.Audience) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
