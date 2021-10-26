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

import {
  LocalMuteAudio,
  LocalMuteVideo,
  RemoteAudioStateChanged,
  RemoteVideoStateChanged,
  UpdateDualStreamMode,
  UserJoined,
  UserMuteRemoteAudio,
  UserMuteRemoteVideo,
  UserOffline,
} from './Reducer';

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
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UpdateDualStreamMode(state, action);
        }
        break;
      case 'UserJoined':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserJoined(state, action, dualStreamMode, uids);
        }
        break;
      case 'UserOffline':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserOffline(state, action);
        }
        break;
      case 'SwapVideo':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = swapVideo(state, action.value[0]);
        }
        break;
      case 'UserMuteRemoteAudio':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserMuteRemoteAudio(state, action);
        }
        break;
      case 'UserMuteRemoteVideo':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserMuteRemoteVideo(state, action);
        }
        break;
      case 'LocalMuteAudio':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = LocalMuteAudio(state, action);
        }
        break;
      case 'LocalMuteVideo':
<<<<<<< Updated upstream
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = LocalMuteVideo(state, action);
        }
=======
        const unique = new Date()
          .valueOf()
          .toString()
          .split('')
          .reverse()
          .join('')
          .slice(0, 2);
        console.log('[Called Mute] - ', unique);

        (engine.current as RtcEngine)
          .muteLocalVideoStream(
            (action as ActionType<'LocalMuteAudio'>).value[0],
          )
          .then(() => {
            console.log('[Done Mute] - ', unique);
          });
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
>>>>>>> Stashed changes
        break;
      case 'RemoteAudioStateChanged':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = RemoteAudioStateChanged(state, action);
        }
        break;
      case 'RemoteVideoStateChanged':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = RemoteVideoStateChanged(state, action);
        }
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
