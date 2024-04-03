import React, {useState, useReducer, useContext, useCallback} from 'react';
import {
  RtcProvider,
  ContentStateInterface,
  ActionType,
  UidType,
  CustomContentInferface,
} from './Contexts/RtcContext';
import {DispatchType} from './Contexts/DispatchContext';
import PropsContext, {
  ToggleState,
  CallbacksInterface,
  DualStreamMode,
  PermissionState,
  ChannelProfileType,
  ClientRoleType,
} from './Contexts/PropsContext';
import {ContentProvider} from './Contexts/ContentContext';
import {actionTypeGuard} from './Utils/actionTypeGuard';

import {
  LocalMuteAudio,
  LocalMuteVideo,
  LocalPermissionState,
  RemoteAudioStateChanged,
  RemoteVideoStateChanged,
  UpdateDualStreamMode,
  UserJoined,
  UserMuteRemoteAudio,
  UserMuteRemoteVideo,
  UserOffline,
  UserPin,
  UserSecondaryPin,
  ActiveSpeaker,
} from './Reducer';
import Create from './Rtc/Create';
import Join from './Rtc/Join';
import useLocalUid from './Utils/useLocalUid';
import {DispatchProvider} from './Contexts/DispatchContext';

const RtcConfigure = (outerProps: {children: React.ReactNode}) => {
  const {callbacks, rtcProps, mode} = useContext(PropsContext);
  let [dualStreamMode, setDualStreamMode] = useState<DualStreamMode>(
    rtcProps?.initialDualStreamMode || DualStreamMode.DYNAMIC,
  );
  const localUid = useLocalUid();

  const initialLocalState: Partial<ContentStateInterface> = {
    customContent: {},
    defaultContent: {
      [localUid]: {
        uid: localUid,
        audio: ToggleState.disabled,
        video: ToggleState.disabled,
        streamType: 'high',
        type: 'rtc',
        permissionStatus: PermissionState.NOT_REQUESTED,
        audioForceDisabled: false,
        videoForceDisabled: false,
      },
    },
    activeUids: rtcProps?.recordingBot ? [] : [localUid],
    pinnedUid: undefined,
    secondaryPinnedUid: undefined,
    lastJoinedUid: 0,
  };

  const [initialState, setInitialState] = React.useState(
    JSON.parse(JSON.stringify(initialLocalState)),
  );

  React.useEffect(() => {
    setInitialState(JSON.parse(JSON.stringify(initialLocalState)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *
   * @param state ContentStateInterface
   * @param action ActionType<'UpdateRenderList'>
   * @returns void
   *
   * UpdateRenderList will update the renderlist for given uid
   *
   */
  const UpdateRenderList = (
    state: ContentStateInterface,
    action: ActionType<'UpdateRenderList'>,
  ) => {
    const newState = {
      ...state,
      defaultContent: {
        ...state.defaultContent,
        [action.value[0]]: {
          ...state.defaultContent[action.value[0]],
          ...action.value[1],
        },
      },
    };
    return newState;
  };

  /**
   *
   * @param state ContentStateInterface
   * @param action ActionType<'AddCustomContent'>
   * @returns void
   *
   * AddCustomContent use to add new data into render position and render list
   */
  // const AddCustomContent = (
  //   state: ContentStateInterface,
  //   action: ActionType<'AddCustomContent'>,
  // ) => {
  //   const newState = {
  //     ...state,
  //     activeUids: [...state.activeUids, action.value[0]],
  //     defaultContent: {
  //       ...state.defaultContent,
  //       [action.value[0]]: {
  //         ...state.defaultContent[action.value[0]],
  //         ...action.value[1],
  //       },
  //     },
  //   };
  //   return newState;
  // };

  const AddCustomContent = (
    state: ContentStateInterface,
    action: ActionType<'AddCustomContent'>,
  ) => {
    const newState = {
      ...state,
      activeUids: state.activeUids.filter((i) => i === action.value[0])?.length
        ? [...state.activeUids]
        : [...state.activeUids, action.value[0]],
      customContent: {
        ...state.customContent,
        [action.value[0]]: {
          uid: action.value[0],
          component: action.value[1]?.component,
          props: action.value[1]?.props,
          onStage: action.value[1]?.onStage,
        },
      },
    };
    return newState;
  };
  const RemoveCustomContent = (
    state: ContentStateInterface,
    action: ActionType<'RemoveCustomContent'>,
  ) => {
    const customContent = state.customContent;
    if (customContent && customContent[action.value[0]]) {
      delete customContent[action.value[0]];
    }
    const newState = {
      ...state,
      activeUids: [...state.activeUids.filter((i) => i !== action.value[0])],
      ...customContent,
    };
    return newState;
  };

  const reducer = (
    state: ContentStateInterface,
    action: ActionType<keyof CallbacksInterface>,
  ) => {
    let stateUpdate = {};

    switch (action.type) {
      case 'AddCustomContent':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = AddCustomContent(state, action);
        }
        break;
      case 'RemoveCustomContent':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = RemoveCustomContent(state, action);
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
      case 'LocalPermissionState':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = LocalPermissionState(state, action, localUid);
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
      case 'UserPin':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserPin(state, action);
        }
        break;
      case 'UserSecondaryPin':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = UserSecondaryPin(state, action);
        }
        break;
      case 'ActiveSpeaker':
        if (actionTypeGuard(action, action.type)) {
          stateUpdate = ActiveSpeaker(state, action);
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
    (state: ContentStateInterface, newMaxUid: UidType) => {
      if (state?.activeUids?.indexOf(newMaxUid) === -1) {
        //skip the update if new max uid is not joined yet.
        return {};
      }
      let activeUids: ContentStateInterface['activeUids'] = [
        ...state.activeUids,
      ];
      let defaultContent: ContentStateInterface['defaultContent'] = {
        ...state.defaultContent,
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
        defaultContent[currentMaxUid]
          ? (defaultContent[currentMaxUid].streamType = 'low')
          : null;
        defaultContent[newMaxUid]
          ? (defaultContent[newMaxUid].streamType = 'high')
          : null;
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
        defaultContent: defaultContent,
      };
    },
    [dualStreamMode],
  );

  /**
   * deque will
   */
  const dequeVideo = useCallback(
    (state: ContentStateInterface, newMaxUid: UidType) => {
      if (state?.activeUids?.indexOf(newMaxUid) === -1) {
        //skip the update if new max uid is not joined yet.
        return {};
      }
      let activeUids: ContentStateInterface['activeUids'] = [
        ...state.activeUids,
      ];
      let defaultContent: ContentStateInterface['defaultContent'] = {
        ...state.defaultContent,
      };
      if (!(newMaxUid in defaultContent)) {
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
        defaultContent[currentMaxUid].streamType = 'low';
        defaultContent[newMaxUid].streamType = 'high';
        // No need to modify the streamType if the mode is not dynamic
      }

      const minIds = activeUids.filter(
        (uid) => uid !== newMaxUid && uid !== currentMaxUid,
      );

      activeUids = [newMaxUid, currentMaxUid, ...minIds];

      return {
        activeUids: activeUids,
        defaultContent: defaultContent,
      };
    },
    [dualStreamMode],
  );

  const [uidState, dispatch]: [ContentStateInterface, DispatchType] =
    useReducer(reducer, initialState);

  const setCustomContent = (
    uid: CustomContentInferface['uid'],
    component: CustomContentInferface['component'],
    props?: CustomContentInferface['props'],
    onStage?: CustomContentInferface['onStage'],
  ) => {
    if (!uid) {
      console.log('debugging UID is not given');
      return;
    } else {
      if (!component) {
        dispatch({
          type: 'RemoveCustomContent',
          value: [uid],
        });
      } else {
        dispatch({
          type: 'AddCustomContent',
          value: [
            uid,
            {component, props, onStage: onStage === undefined ? true : onStage},
          ],
        });
      }
    }
  };
  return (
    <Create dispatch={dispatch}>
      {(engineRef, tracksReady) => (
        <Join
          precall={!rtcProps?.callActive}
          preventJoin={rtcProps?.preventJoin}
          engineRef={engineRef}
          uidState={uidState}
          dispatch={dispatch}
          tracksReady={tracksReady}>
          <DispatchProvider value={{dispatch}}>
            <RtcProvider
              value={{
                RtcEngineUnsafe: engineRef.current,
                setDualStreamMode,
              }}>
              <ContentProvider
                value={{
                  customContent: uidState.customContent,
                  setCustomContent: setCustomContent,
                  defaultContent: uidState.defaultContent,
                  activeUids:
                    //In livestreaming mode ->audience should not see their local video tile
                    mode ===
                      ChannelProfileType.ChannelProfileLiveBroadcasting &&
                    rtcProps?.role === ClientRoleType.ClientRoleAudience
                      ? [
                          ...new Set(
                            uidState.activeUids.filter((i) => i !== localUid),
                          ),
                        ]
                      : [
                          ...new Set(
                            uidState.activeUids.filter((i) => i !== undefined),
                          ),
                        ],
                  pinnedUid:
                    uidState?.pinnedUid &&
                    uidState?.activeUids?.indexOf(uidState.pinnedUid) !== -1
                      ? uidState.pinnedUid
                      : undefined,
                  secondaryPinnedUid:
                    uidState?.secondaryPinnedUid &&
                    uidState?.activeUids?.indexOf(
                      uidState.secondaryPinnedUid,
                    ) !== -1
                      ? uidState.secondaryPinnedUid
                      : undefined,
                  lastJoinedUid: uidState.lastJoinedUid,
                }}>
                {outerProps.children}
              </ContentProvider>
            </RtcProvider>
          </DispatchProvider>
        </Join>
      )}
    </Create>
  );
};

export default RtcConfigure;
