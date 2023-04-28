import {DualStreamMode, ToggleState} from '../Contexts/PropsContext';
import {
  ActionType,
  ContentStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function UserJoined(
  state: ContentStateInterface,
  action: ActionType<'UserJoined'>,
  dualStreamMode: DualStreamMode,
  localUid: UidType,
) {
  const newUid = action.value[0];
  let stateUpdate = {};
  //default type will be rtc
  let typeData = {
    type: 'rtc',
  };
  if (state.defaultContent[newUid] && 'type' in state.defaultContent[newUid]) {
    typeData.type = state.defaultContent[newUid].type;
  }

  let defaultContent: ContentStateInterface['defaultContent'] = {
    ...state.defaultContent,
    [newUid]: {
      ...state.defaultContent[newUid],
      uid: newUid,
      audio: ToggleState.disabled,
      video: ToggleState.disabled,
      streamType: dualStreamMode === DualStreamMode.HIGH ? 'high' : 'low', // Low if DualStreamMode is LOW or DYNAMIC by default,
      ...typeData,
    },
  };
  let activeUids = state.activeUids.filter((i) => i === newUid).length
    ? [...state.activeUids]
    : [...state.activeUids, newUid];
  const [maxUid] = activeUids;
  if (activeUids.length === 2 && maxUid === localUid) {
    //Only one remote and local is maximized
    //Change stream type to high if dualStreaMode is DYNAMIC
    if (dualStreamMode === DualStreamMode.DYNAMIC) {
      defaultContent[newUid].streamType = 'high';
    }
    //Swap render positions
    stateUpdate = {
      activeSpeaker: state.activeSpeaker,
      defaultContent: defaultContent,
      activeUids: activeUids.reverse(),
      lastJoinedUid: newUid,
    };
  } else {
    //More than one remote
    stateUpdate = {
      activeSpeaker: state.activeSpeaker,
      defaultContent: defaultContent,
      activeUids: activeUids,
      lastJoinedUid: newUid,
    };
  }

  console.log('new user joined!\n', state, stateUpdate, {
    dualStreamMode,
  });
  return stateUpdate;
}
