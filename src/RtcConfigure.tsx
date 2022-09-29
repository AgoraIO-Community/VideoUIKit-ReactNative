import React, {useState, useReducer, useContext, useCallback} from 'react';
import {
  RtcProvider,
  RenderStateInterface,
  DispatchType,
  ActionType,
  UidType,
} from './Contexts/RtcContext';
import PropsContext, {
  ToggleState,
  RtcPropsInterface,
  CallbacksInterface,
  DualStreamMode,
} from './Contexts/PropsContext';
import {RenderProvider} from './Contexts/RenderContext';
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
import Create from './Rtc/Create';
import Join from './Rtc/Join';
import useLocalUid from './Utils/useLocalUid';

const RtcConfigure = (props: {children: React.ReactNode}) => {
  const {callbacks, rtcProps} = useContext(PropsContext);
  let [dualStreamMode, setDualStreamMode] = useState<DualStreamMode>(
    rtcProps?.initialDualStreamMode || DualStreamMode.DYNAMIC,
  );
  const localUid = useLocalUid();
  const initialLocalState: RenderStateInterface = {
    renderList: {
      [localUid]: {
        uid: localUid,
        audio: ToggleState.disabled,
        video: ToggleState.disabled,
        streamType: 'high',
        type: 'rtc',
      },
    },
    activeUids: [localUid],
  };

  const [initialState, setInitialState] = React.useState(
    JSON.parse(JSON.stringify(initialLocalState)),
  );

  React.useEffect(() => {
    setInitialState(JSON.parse(JSON.stringify(initialLocalState)));
  }, []);

  /**
   *
   * @param state RenderStateInterface
   * @param action ActionType<'UpdateRenderList'>
   * @returns void
   *
   * UpdateRenderList will update the renderlist for given uid
   *
   */
  const UpdateRenderList = (
    state: RenderStateInterface,
    action: ActionType<'UpdateRenderList'>,
  ) => {
    const newState = {
      ...state,
      renderList: {
        ...state.renderList,
        [action.value[0]]: {
          ...state.renderList[action.value[0]],
          ...action.value[1],
        },
      },
    };
    return newState;
  };

  /**
   *
   * @param state RenderStateInterface
   * @param action ActionType<'AddCustomContent'>
   * @returns void
   *
   * AddCustomContent use to add new data into render position and render list
   */
  const AddCustomContent = (
    state: RenderStateInterface,
    action: ActionType<'AddCustomContent'>,
  ) => {
    const newState = {
      ...state,
      activeUids: [...state.activeUids, action.value[0]],
      renderList: {
        ...state.renderList,
        [action.value[0]]: {
          ...state.renderList[action.value[0]],
          ...action.value[1],
        },
      },
    };
    return newState;
  };

  const reducer = (
    state: RenderStateInterface,
    action: ActionType<keyof CallbacksInterface>,
  ) => {
    let stateUpdate = {};

    switch (action.type) {
      case 'AddCustomContent':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = AddCustomContent(state, action);
        }
        break;
      case 'UpdateRenderList':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UpdateRenderList(state, action);
        }
        break;
      case 'UpdateDualStreamMode':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UpdateDualStreamMode(state, action);
        }
        break;
      case 'UserJoined':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserJoined(state, action, dualStreamMode, localUid);
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
      case 'DequeVideo':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = dequeVideo(state, action.value[0]);
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
          stateUpdate = LocalMuteAudio(state, action, localUid);
        }
        break;
      case 'LocalMuteVideo':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = LocalMuteVideo(state, action, localUid);
        }
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
    (state: RenderStateInterface, newMaxUid: UidType) => {
      if (state?.activeUids?.indexOf(newMaxUid) === -1) {
        //skip the update if new max uid is not joined yet.
        return {};
      }
      let activeUids: RenderStateInterface['activeUids'] = [
        ...state.activeUids,
      ];
      let renderList: RenderStateInterface['renderList'] = {
        ...state.renderList,
      };

      // Element which is currently maximized
      const [currentMaxUid] = activeUids;

      if (currentMaxUid === newMaxUid) {
        //skip the update if new max uid is already maximized
        return {};
      }

      const newMaxUidOldPosition = activeUids.findIndex((i) => i === newMaxUid);

      if (!newMaxUidOldPosition) {
        return {};
      }

      if (dualStreamMode === DualStreamMode.DYNAMIC) {
        renderList[currentMaxUid].streamType = 'low';
        renderList[newMaxUid].streamType = 'high';
        // No need to modify the streamType if the mode is not dynamic
      }

      /**
       * old logic for swap
       * if currentMaxUid === localUid then push newMaxId at first position
       * else push newMaxUid at last position
       */

      activeUids[0] = newMaxUid;
      activeUids[newMaxUidOldPosition] = currentMaxUid;

      return {
        activeUids: activeUids,
        renderList: renderList,
      };
    },
    [dualStreamMode],
  );

  /**
   * deque will
   */
  const dequeVideo = useCallback(
    (state: RenderStateInterface, newMaxUid: UidType) => {
      if (state?.activeUids?.indexOf(newMaxUid) === -1) {
        //skip the update if new max uid is not joined yet.
        return {};
      }
      let activeUids: RenderStateInterface['activeUids'] = [
        ...state.activeUids,
      ];
      let renderList: RenderStateInterface['renderList'] = {
        ...state.renderList,
      };
      if (!(newMaxUid in renderList)) {
        //skip the update if new max uid is not joined yet.
        return {};
      }
      // Element which is currently maximized
      const [currentMaxUid] = activeUids;

      if (currentMaxUid === newMaxUid) {
        //skip the update if new max uid is already maximized
        return {};
      }

      if (dualStreamMode === DualStreamMode.DYNAMIC) {
        renderList[currentMaxUid].streamType = 'low';
        renderList[newMaxUid].streamType = 'high';
        // No need to modify the streamType if the mode is not dynamic
      }

      const minIds = activeUids.filter(
        (uid) => uid !== newMaxUid && uid !== currentMaxUid,
      );

      activeUids = [newMaxUid, currentMaxUid, ...minIds];

      return {
        activeUids: activeUids,
        renderList: renderList,
      };
    },
    [dualStreamMode],
  );

  const [uidState, dispatch]: [RenderStateInterface, DispatchType] = useReducer(
    reducer,
    initialState,
  );

  return (
    <Create dispatch={dispatch}>
      {(engineRef) => (
        <Join
          precall={!rtcProps.callActive}
          engineRef={engineRef}
          uidState={uidState}
          dispatch={dispatch}>
          <RtcProvider
            value={{
              RtcEngine: engineRef.current,
              dispatch,
              setDualStreamMode,
            }}>
            <RenderProvider
              value={{
                renderList: uidState.renderList,
                activeUids: uidState.activeUids,
              }}>
              {props.children}
            </RenderProvider>
          </RtcProvider>
        </Join>
      )}
    </Create>
  );
};

export default RtcConfigure;
