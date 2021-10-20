import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
  useCallback,
  useDebugValue,
} from 'react';
import RtcEngine, {
  VideoEncoderConfiguration,
  AreaCode,
} from 'react-native-agora';
import {Platform} from 'react-native';
import requestCameraAndAudioPermission from './Utils/permission';
import {
  RtcProvider,
  UidStateInterface,
  DispatchType,
  ActionType,
} from './Contexts/RtcContext';
import PropsContext, {
  ToggleState,
  UidInterface,
  RtcPropsInterface,
  CallbacksInterface,
  DualStreamMode,
} from './Contexts/PropsContext';
import {MinUidProvider} from './Contexts/MinUidContext';
import {MaxUidProvider} from './Contexts/MaxUidContext';
import quality from './Utils/quality';
import {actionTypeGuard} from './Utils/actionTypeGuard';

const initialState: UidStateInterface = {
  min: [],
  max: [
    {
      uid: 'local',
      audio: ToggleState.enabled,
      video: ToggleState.enabled,
      streamType: 'high',
    },
  ],
};

const RtcConfigure: React.FC<Partial<RtcPropsInterface>> = (props) => {
  const [ready, setReady] = useState<boolean>(false);
  useDebugValue(ready, (ready) => `ready to join ${String(ready)}`);
  let joinRes: ((arg0: boolean) => void) | null = null;
  let canJoin = useRef(new Promise<boolean | void>((res) => (joinRes = res)));
  const {callbacks, rtcProps} = useContext(PropsContext);
  let engine = useRef<RtcEngine | null>(null);
  let [dualStreamMode, setDualStreamMode] = useState<DualStreamMode>(
    rtcProps.initialDualStreamMode || DualStreamMode.DYNAMIC,
  );
  let {callActive} = props;
  callActive === undefined ? (callActive = true) : {};

  const reducer = (
    state: UidStateInterface,
    action: ActionType<keyof CallbacksInterface>,
  ) => {
    let stateUpdate = {},
      uids = [...state.max, ...state.min].map((u: UidInterface) => u.uid);

    switch (action.type) {
      case 'UpdateDualStreamMode':
        const newMode = (action as ActionType<'UpdateDualStreamMode'>).value[0];
        if (newMode === DualStreamMode.HIGH) {
          // Update everybody to high
          const maxStateUpdate: UidInterface[] = state.max.map((user) => ({
            ...user,
            streamType: 'high',
          }));
          const minStateUpdate: UidInterface[] = state.min.map((user) => ({
            ...user,
            streamType: 'high',
          }));
          stateUpdate = {min: minStateUpdate, max: maxStateUpdate};
        } else if (newMode === DualStreamMode.LOW) {
          // Update everybody to low
          const maxStateUpdate: UidInterface[] = state.max.map((user) => ({
            ...user,
            streamType: 'low',
          }));
          const minStateUpdate: UidInterface[] = state.min.map((user) => ({
            ...user,
            streamType: 'low',
          }));
          stateUpdate = {min: minStateUpdate, max: maxStateUpdate};
        } else if (newMode === DualStreamMode.DYNAMIC) {
          // Max users are high other are low
          const maxStateUpdate: UidInterface[] = state.max.map((user) => ({
            ...user,
            streamType: 'high',
          }));
          const minStateUpdate: UidInterface[] = state.min.map((user) => ({
            ...user,
            streamType: 'low',
          }));
          stateUpdate = {min: minStateUpdate, max: maxStateUpdate};
        }
        break;
      case 'UserJoined':
        if (
          uids.indexOf((action as ActionType<'UserJoined'>).value[0]) === -1
        ) {
          //If new user has joined
          //By default add to minimized
          let minUpdate = [
            ...state.min,
            {
              uid: (action as ActionType<'UserJoined'>).value[0],
              audio: ToggleState.disabled,
              video: ToggleState.disabled,
              streamType:
                dualStreamMode === DualStreamMode.HIGH ? 'high' : 'low', // Low if DualStreamMode is LOW or DYNAMIC by default
            },
          ];

          if (minUpdate.length === 1 && state.max[0].uid === 'local') {
            //Only one remote and local is maximized
            //Change stream type to high if dualStreaMode is DYNAMIC
            if (dualStreamMode === DualStreamMode.DYNAMIC) {
              minUpdate[0].streamType = 'high';
            }
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

          console.log('new user joined!\n', state, stateUpdate, {
            dualStreamMode,
          });
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
            user.audio = action.value[1];
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
        // (engine.current as RtcEngine).muteLocalAudioStream(
        //   (action as ActionType<'LocalMuteAudio'>).value[0],
        // );

        if (actionTypeGuard(action, action.type)) {
          const LocalAudioMute = (user: UidInterface) => {
            if (user.uid === 'local') {
              user.audio = action.value[0];
            }
            return user;
          };
          stateUpdate = {
            min: state.min.map(LocalAudioMute),
            max: state.max.map(LocalAudioMute),
          };
        }
        break;
      case 'LocalMuteVideo':
        // (engine.current as RtcEngine).muteLocalVideoStream(
        //   (action as ActionType<'LocalMuteAudio'>).value[0],
        // );
        const LocalVideoMute = (user: UidInterface) => {
          if (user.uid === 'local') {
            user.video = (action as ActionType<'LocalMuteVideo'>).value[0];
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(LocalVideoMute),
          max: state.max.map(LocalVideoMute),
        };
        break;
      case 'RemoteAudioStateChanged':
        let audioState: boolean;
        if ((action as ActionType<'RemoteAudioStateChanged'>).value[1] === 0) {
          audioState = false;
        } else if (
          (action as ActionType<'RemoteAudioStateChanged'>).value[1] === 2
        ) {
          audioState = true;
        }
        const audioChange = (user: UidInterface) => {
          if (user.uid === action.value[0]) {
            user.audio = audioState;
            // user.video = user.video;
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(audioChange),
          max: state.max.map(audioChange),
        };
        break;
      case 'RemoteVideoStateChanged':
        let videoState: boolean;
        if ((action as ActionType<'RemoteVideoStateChanged'>).value[1] === 0) {
          videoState = false;
        } else if (
          (action as ActionType<'RemoteVideoStateChanged'>).value[1] === 2
        ) {
          videoState = true;
        }
        const videoChange = (user: UidInterface) => {
          if (
            user.uid ===
            (action as ActionType<'RemoteVideoStateChanged'>).value[0]
          ) {
            user.video = videoState
              ? ToggleState.enabled
              : ToggleState.disabled;
            // user.audio = user.audio;
          }
          return user;
        };
        stateUpdate = {
          min: state.min.map(videoChange),
          max: state.max.map(videoChange),
        };
        break;
    }

    // TODO: remove Handle event listeners

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

  const swapVideo = useCallback(
    (state: UidStateInterface, ele: UidInterface) => {
      let newState: UidStateInterface = {
        min: [],
        max: [],
      };
      // Remove the minimized element which is being swapped out
      newState.min = state.min.filter((e) => e !== ele);

      let maxEle = state.max[0]; // Element which is currently maximized
      let minEle = ele;

      if (dualStreamMode === DualStreamMode.DYNAMIC) {
        maxEle.streamType = 'low'; // set stream quality to low
        minEle.streamType = 'high'; // set stream quality to high

        // No need to modify the streamType if the mode is not dynamic
      }

      if (maxEle.uid === 'local') {
        newState.min.unshift(maxEle);
      } else {
        newState.min.push(maxEle);
      }
      newState.max = [minEle];

      return newState;
    },
    [dualStreamMode],
  );
  const [uidState, dispatch]: [UidStateInterface, DispatchType] = useReducer(
    reducer,
    initialState,
  );

  // When mode is updated, reducer is triggered to update the individual states
  useEffect(() => {
    dispatch({
      type: 'UpdateDualStreamMode',
      value: [dualStreamMode],
    });
  }, [dualStreamMode]);

  // useEffect(() => {
  //   const setStreamType = (user: UidInterface) => {
  //     if (user.uid !== 'local') {
  //       engine.current?.setRemoteVideoStreamType(
  //         user.uid as number,
  //         user.streamType === 'high' ? 0 : 1,
  //       );
  //     }
  //   };
  //   uidState.max.map(setStreamType);
  //   uidState.min.map(setStreamType);
  // }, [uidState.min, uidState.max]);

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
        console.log(engine.current);
        if (rtcProps.profile) {
          if (Platform.OS === 'web') {
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
          await engine.current.enableVideo();
        } catch (e) {
          dispatch({
            type: 'LocalMuteAudio',
            value: [true],
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
          console.log('RemoteAudioStateChanged', args);

          dispatch({
            type: 'RemoteAudioStateChanged',
            value: args,
          });
        });

        engine.current.addListener('Error', (e) => {
          console.log('Error: ', e);
        });

        engine.current.addListener('RemoteVideoStateChanged', (...args) => {
          console.log('RemoteVideoStateChanged', args);

          dispatch({
            type: 'RemoteVideoStateChanged',
            value: args,
          });
        });

        (joinRes as (arg0: boolean) => void)(true);
        setReady(true);
      } catch (e) {
        console.error(e);
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
      if (
        engine.current &&
        rtcProps.encryption &&
        rtcProps.encryption.key &&
        rtcProps.encryption.mode
      ) {
        console.log('using channel encryption', rtcProps.encryption);
        // await engine.current.setEncryptionSecret(rtcProps.encryption.key);
        // await engine.current.setEncryptionMode(rtcProps.encryption.mode);
        await engine.current.enableEncryption(true, {
          encryptionKey: rtcProps.encryption.key,
          encryptionMode: rtcProps.encryption.mode,
        });
      }
      if (engine.current) {
        if (uidState.max[0].video) {
          await engine.current.muteLocalVideoStream(true);
        }

        await engine.current.joinChannel(
          rtcProps.token || null,
          rtcProps.channel,
          null,
          rtcProps.uid || 0,
        );
        if (uidState.max[0].video) {
          await engine.current.muteLocalVideoStream(false);
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
  }, [rtcProps.channel, rtcProps.uid, rtcProps.token, callActive]);

  return (
    <RtcProvider
      value={{
        RtcEngine: engine.current as RtcEngine,
        dispatch,
        setDualStreamMode,
      }}>
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
