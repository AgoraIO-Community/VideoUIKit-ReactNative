import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';
import RtcEngine from 'react-native-agora';
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
} from './PropsContext';
import {MinUidProvider} from './MinUidContext';
import {MaxUidProvider} from './MaxUidContext';

const initialState: UidStateInterface = {
  min: [],
  max: [
    {
      uid: 'local',
      audio: true,
      video: true,
    },
  ],
};

const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const [ready, setReady] = useState<boolean>(false);
  let joinRes: ((arg0: boolean) => void) | null = null;
  let canJoin = useRef(new Promise<boolean | void>((res) => (joinRes = res)));
  const {callbacks, rtcProps} = useContext(PropsContext);
  let engine = useRef<RtcEngine | null>(null);
  let {callActive} = props;
  callActive === undefined ? (callActive = true) : {};

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

          console.log('new user joined!\n', state, stateUpdate);
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
        stateUpdate = swapVideo(state, action.value[0] as UidInterface);
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
      case 'RemoteAudioStateChanged':
        let audioState;
        if (action.value[1] === 0) {
          audioState = false;
        } else if (action.value[1] === 2) {
          audioState = true;
        }
        const audioChange = (user: UidInterface) => {
          if (user.uid == action.value[0]) {
            user.audio = audioState;
            user.video = user.video;
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(audioChange),
          max: state.max.map(audioChange),
        };
        break;
      case 'RemoteVideoStateChanged':
        let videoState;
        let logx= action.value;
        if (action.value[1] === 0) {
          videoState = false;
        } else if (action.value[1] === 2) {
          videoState = true;
        }
        const videoChange = (user: UidInterface) => {
          if (user.uid == action.value[0]) {
            user.video = videoState;
            user.audio = user.audio;
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(videoChange),
          max: state.max.map(videoChange),
        };
        break;
    }

    // Handle event listeners

    if (callbacks && callbacks[action.type]) {
      // @ts-ignore
      callbacks[action.type].apply(null, action.value);
      console.log('callback executed');
    } else {
      // console.log('callback not found', action.type);
    }

    // console.log(state, action, stateUpdate);

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
    if (state.max[0].uid === 'local') {
      newState.min.unshift(state.max[0]);
    } else {
      newState.min.push(state.max[0]);
    }
    newState.max = [ele];

    return newState;
  };

  const [uidState, dispatch] = useReducer(reducer, initialState);

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

        if (rtcProps.dual) {
          await engine.current.enableDualStreamMode(rtcProps.dual);
          await engine.current.setRemoteSubscribeFallbackOption(1);
        }

        if (
          rtcProps.encryption &&
          rtcProps.encryption.key &&
          rtcProps.encryption.mode
        ) {
          await engine.current.setEncryptionSecret(rtcProps.encryption.key);
          await engine.current.setEncryptionMode(rtcProps.encryption.mode);
        }

        engine.current.addListener('UserJoined', (...args) => {
          //Get current peer IDs
          (dispatch as DispatchType<'UserJoined'>)({
            type: 'UserJoined',
            value: args,
          });
        });

        engine.current.addListener('UserOffline', (...args) => {
          //If user leaves
          (dispatch as DispatchType<'UserOffline'>)({
            type: 'UserOffline',
            value: args,
          });
        });

        engine.current.addListener('RemoteAudioStateChanged', (...args) => {
          (dispatch as DispatchType<'RemoteAudioStateChanged'>)({
            type: 'RemoteAudioStateChanged',
            value: args,
          });
        });

        engine.current.addListener('RemoteVideoStateChanged', (...args) => {
          dispatch({
            type: 'RemoteVideoStateChanged',
            value: args,
          });
        });

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
        engine.current.joinChannel(
          rtcProps.token || null,
          rtcProps.channel,
          null,
          rtcProps.uid || 0,
        );
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
  }, [rtcProps.channel, rtcProps.uid, rtcProps.token, callActive]);

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
