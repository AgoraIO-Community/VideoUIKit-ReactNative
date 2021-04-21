//setParameters()
import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  StreamFallbackOptions,
} from 'react-native-agora';
import {Platform} from 'react-native';
import requestCameraAndAudioPermission from './permission';
import {
  RtcProvider,
  UidInterface,
  UidStateInterface,
  DispatchType,
  ActionInterface,
  ActionType,
} from './RtcContext';
import PropsContext, {
  RtcPropsInterface,
  CallbacksInterface,
  layout,
  mode,
  role,
} from './PropsContext';
import {MinUidProvider} from './MinUidContext';
import {MaxUidProvider} from './MaxUidContext';
// useeffect -> if audience enablelocalvideo(false);

const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const {callbacks, rtcProps} = useContext(PropsContext);
  const [ready, setReady] = useState<boolean>(false);
  let joinRes: ((arg0: boolean) => void) | null = null;
  let canJoin = useRef(new Promise<boolean | void>((res) => (joinRes = res)));
  let engine = useRef<RtcEngine | null>(null);
  let {callActive} = props;
  callActive === undefined ? (callActive = true) : {};

  const initialState: UidStateInterface = {
    min: [],
    max: [
      {
        uid: 'local',
        audio: rtcProps.enableAudio ? rtcProps.enableAudio : true, //bug - check from prop
        video: rtcProps.enableVideo ? rtcProps.enableVideo : true, //bug - check from prop (rtcProps.defaultAudioEnabled)
      },
    ],
  };

  const reducer = (
    state: UidStateInterface,
    action: ActionInterface<keyof CallbacksInterface, CallbacksInterface>,
  ) => {
    let stateUpdate = {},
      uids = [...state.max, ...state.min].map((u: UidInterface) => u.uid);

    switch (action.type) {
      case 'UserJoined':
        if (
          uids.indexOf((action as ActionType<'UserJoined'>).value[0]) === -1
        ) {
          //If new user has joined

          let minUpdate = [
            ...state.min,
            {
              uid: (action as ActionType<'UserJoined'>).value[0],
              audio: true,
              video: true,
            },
          ]; //By default add to minimized

          if (minUpdate.length === 1 && state.max[0].uid === 'local') {
            //Only one remote and local is maximized
            //Swap max and min
            stateUpdate = {
              max: minUpdate,
              min: state.max,
            };
          } else {
            //More than one remote
            stateUpdate = {
              min: minUpdate,
            };
          }

          // if (rtcProps.manualDualStream === 2) {
          //   if (uids.length > 1) {
          //     engine.current?.setRemoteVideoStreamType(
          //       (action as ActionType<'UserJoined'>).value[0],
          //       VideoStreamType.Low,
          //     );
          //   }
          // } else if (rtcProps.manualDualStream === 1) {
          //   if (uids.length > 1) {
          //     engine.current?.setRemoteVideoStreamType(
          //       (action as ActionType<'UserJoined'>).value[0],
          //       VideoStreamType.High,
          //     );
          //   }
          // } else if (rtcProps.manualDualStream === 0) {
          //   if (uids.length > 1) {
          //     engine.current?.setRemoteVideoStreamType(
          //       (action as ActionType<'UserJoined'>).value[0],
          //       VideoStreamType.Low,
          //     );
          //   }
          // }
          console.log('new user joined!\n');
        }
        break;
      case 'UserOffline':
        if (
          state.max[0].uid === (action as ActionType<'UserOffline'>).value[0]
        ) {
          //If max has the remote video
          let minUpdate = [...state.min];
          stateUpdate = {
            max: [minUpdate.pop()],
            min: minUpdate,
          };
        } else {
          stateUpdate = {
            min: state.min.filter(
              (user) =>
                user.uid !== (action as ActionType<'UserOffline'>).value[0],
            ),
          };
        }
        break;
      case 'SwapVideo':
        console.log('swap: ', state, action.value[0]);
        stateUpdate = swapVideo(state, action.value[0] as UidInterface);
        break;
      case 'TokenPrivilegeWillExpire':
        const UID = rtcProps.uid || 0;
        console.log('TokenPrivilegeWillExpire: ', action.value[0], UID);
        fetch(
          rtcProps.tokenUrl +
            '/rtc/' +
            rtcProps.channel +
            '/publisher/uid/' +
            UID,
        )
          .then((response) => {
            response.json().then((data) => {
              engine.current?.renewToken(data.rtcToken);
            });
          })
          .catch(function (err) {
            console.log('Fetch Error', err);
          });
        break;
      case 'ActiveSpeaker':
        // console.log('speak: ', state, action.value[0]);
        // convert into for each / map
        let users = [...state.max, ...state.min];
        let swapUid = action.value[0];
        users.forEach((user) => {
          if (user.uid === swapUid) {
            stateUpdate = swapVideo(state, user);
          }
        });
        // for (let i = 0; i < users.length; i++) {
        //   if (users[i].uid === swapUid) {
        //     stateUpdate = swapVideo(state, users[i]);
        //     break;
        //   }
        // }
        break;
      case 'UserMuteRemoteAudio':
        const audioMute = (user: UidInterface) => {
          if (user.uid === (action.value[0] as UidInterface).uid) {
            user.audio = !action.value[1];
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(audioMute),
          max: state.max.map(audioMute),
        };
        break;
      case 'UserMuteRemoteVideo':
        const videoMute = (user: UidInterface) => {
          if (user.uid === (action.value[0] as UidInterface).uid) {
            user.video = !action.value[1];
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(videoMute),
          max: state.max.map(videoMute),
        };
        break;
      case 'LocalMuteAudio':
        (engine.current as RtcEngine).muteLocalAudioStream(
          (action as ActionType<'LocalMuteAudio'>).value[0],
        );
        const LocalAudioMute = (user: UidInterface) => {
          if (user.uid === 'local') {
            user.audio = !(action as ActionType<'LocalMuteAudio'>).value[0];
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(LocalAudioMute),
          max: state.max.map(LocalAudioMute),
        };
        break;
      case 'LocalMuteVideo':
        (engine.current as RtcEngine).muteLocalVideoStream(
          (action as ActionType<'LocalMuteAudio'>).value[0],
        );
        const LocalVideoMute = (user: UidInterface) => {
          if (user.uid === 'local') {
            user.video = !(action as ActionType<'LocalMuteVideo'>).value[0];
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(LocalVideoMute),
          max: state.max.map(LocalVideoMute),
        };
        break;
      case 'SwitchCamera':
        (engine.current as RtcEngine).switchCamera();
        break;
      case 'LeaveChannel':
        stateUpdate = {
          min: [],
          max: [
            {
              uid: 'local',
              audio: rtcProps.enableAudio ? rtcProps.enableAudio : true,
              video: rtcProps.enableVideo ? rtcProps.enableVideo : true,
            },
          ],
        };
    }

    // Handle event listeners
    if (callbacks && callbacks[action.type]) {
      // @ts-ignore
      callbacks[action.type].apply(null, action.value);
      console.log('callback executed');
    } else {
      // console.log('callback not found', action);
    }

    return {
      ...state,
      ...stateUpdate,
    };
  };

  const swapVideo = (state: UidStateInterface, ele: UidInterface) => {
    let newState: UidStateInterface = {
      min: [],
      max: [],
    };
    newState.min = state.min.filter((e) => e !== ele);
    // if (rtcProps.manualDualStream === 2) {
    //   if (ele.uid !== 'local') {
    //     engine.current?.setRemoteVideoStreamType(
    //       ele.uid as number,
    //       VideoStreamType.High,
    //     );
    //   }
    // }
    if (state.max[0].uid === 'local') {
      newState.min.unshift(state.max[0]);
    } else {
      newState.min.push(state.max[0]);
      // if (rtcProps.manualDualStream === 2) {
      //   engine.current?.setRemoteVideoStreamType(
      //     state.max[0].uid as number,
      //     VideoStreamType.Low,
      //   );
      // }
    }
    newState.max = [ele];

    return newState;
  };

  const [uidState, dispatch] = useReducer(reducer, initialState); //update third variable -> pass props

  useEffect(() => {
    async function init() {
      if (Platform.OS === 'android') {
        //Request required permissions from Android
        await requestCameraAndAudioPermission();
      }
      try {
        engine.current = await RtcEngine.create(rtcProps.appId);
        console.log(engine.current);
        await engine.current.enableVideo();

        /* Listeners */
        engine.current.addListener('UserJoined', (...args) => {
          //Get current peer IDs
          (dispatch as DispatchType<'UserJoined'>)({
            type: 'UserJoined',
            value: args,
          });
        });

        engine.current.addListener('UserOffline', (...args) => {
          //If remote user leaves
          (dispatch as DispatchType<'UserOffline'>)({
            type: 'UserOffline',
            value: args,
          });
        });

        engine.current.addListener('LeaveChannel', (...args) => {
          //If local user leaves channel
          (dispatch as DispatchType<'LeaveChannel'>)({
            type: 'LeaveChannel',
            value: args,
          });
        });

        /* ActiveSpeaker */
        if (rtcProps.activeSpeaker && rtcProps.layout === layout.pin) {
          console.log('ActiveSpeaker enabled');
          await engine.current.enableAudioVolumeIndication(1000, 3, false);
          engine.current.addListener('ActiveSpeaker', (...args) => {
            (dispatch as DispatchType<'ActiveSpeaker'>)({
              type: 'ActiveSpeaker',
              value: args,
            });
          });
        }

        /* Token URL */
        if (rtcProps.tokenUrl) {
          engine.current.addListener('TokenPrivilegeWillExpire', (...args) => {
            (dispatch as DispatchType<'TokenPrivilegeWillExpire'>)({
              type: 'TokenPrivilegeWillExpire',
              value: args,
            });
          });
        }

        (joinRes as (arg0: boolean) => void)(true);
        setReady(true);
      } catch (e) {
        console.log(e);
      }
    }

    if (joinRes) {
      init();
      return () => {
        (engine.current as RtcEngine).destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rtcProps.appId]);

  // Dynamically switches channel when channel prop changes
  useEffect(() => {
    async function join() {
      await canJoin.current;
      if (engine.current) {
        /* Dual Stream */
        if (rtcProps.enableDualStream === true) {
          await engine.current.enableDualStreamMode(rtcProps.enableDualStream);
          await engine.current.setRemoteSubscribeFallbackOption(
            StreamFallbackOptions.VideoStreamLow,
          );
        } else if (rtcProps.enableDualStream === false) {
          await engine.current.enableDualStreamMode(rtcProps.enableDualStream);
        }
        /* Live Streaming */
        if (rtcProps.mode === mode.LiveBroadcasting) {
          await engine.current.setChannelProfile(
            ChannelProfile.LiveBroadcasting,
          );
          await engine.current.setClientRole(
            rtcProps.role === role.Audience
              ? ClientRole.Audience
              : ClientRole.Broadcaster,
          );
        } else {
          await engine.current.setChannelProfile(ChannelProfile.Communication);
        }
        /* Token URL */
        if (rtcProps.tokenUrl) {
          const UID = rtcProps.uid || 0;
          fetch(
            rtcProps.tokenUrl +
              '/rtc/' +
              rtcProps.channel +
              '/publisher/uid/' +
              UID,
          )
            .then((response) => {
              response.json().then((data) => {
                engine.current?.joinChannel(
                  data.rtcToken,
                  rtcProps.channel,
                  null,
                  UID,
                );
              });
            })
            .catch(function (err) {
              console.log('Fetch Error', err);
            });
        } else {
          engine.current.joinChannel(
            rtcProps.token || null,
            rtcProps.channel,
            null,
            rtcProps.uid || 0,
          );
        }
      } else {
        console.error('trying to join before RTC Engine was initialized');
      }
    }
    if (callActive) {
      join();
      console.log('Attempted join: ', rtcProps.channel);
    } else {
      console.log('In precall - waiting to join');
    }
    return () => {
      if (callActive) {
        console.log('Leaving channel');
        canJoin.current = (engine.current as RtcEngine)
          .leaveChannel()
          .catch((err: any) => console.log(err));
      }
    };
  }, [
    rtcProps.channel,
    rtcProps.uid,
    rtcProps.token,
    callActive,
    rtcProps.tokenUrl,
    rtcProps.role,
    rtcProps.mode,
    rtcProps.enableDualStream,
  ]);

  // disable local video if audience
  // useEffect(() => {
  //   if (
  //     (rtcProps.role === role.Audience) ||
  //     rtcProps.enableVideo === false
  //   ) {
  //     engine.current?.enableLocalVideo(false);
  //   } else {
  //     engine.current?.enableLocalVideo(true);
  //   }
  // }, [rtcProps.mode, rtcProps.role, rtcProps.enableVideo]);

  return (
    <RtcProvider value={{RtcEngine: engine.current as RtcEngine, dispatch}}>
      <MaxUidProvider value={uidState.max}>
        <MinUidProvider value={uidState.min}>
          {
            // Render children once RTCEngine has been initialized
            ready ? props.children : <></>
          }
        </MinUidProvider>
      </MaxUidProvider>
    </RtcProvider>
  );
};

export default RtcConfigure;
