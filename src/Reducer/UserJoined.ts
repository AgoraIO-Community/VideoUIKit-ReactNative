import {DualStreamMode, ToggleState} from '../Contexts/PropsContext';
import {
  ActionType,
  RenderStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function UserJoined(
  state: RenderStateInterface,
  action: ActionType<'UserJoined'>,
  dualStreamMode: DualStreamMode,
  uids: (string | number)[],
  localUid: UidType,
) {
  let stateUpdate = {};
  //default type will be rtc
  let typeData = {
    type: 'rtc',
  };
  if (
    state.renderList[action.value[0]] &&
    'type' in state.renderList[action.value[0]]
  ) {
    typeData.type = state.renderList[action.value[0]].type;
  }

  let renderList: RenderStateInterface['renderList'] = {
    ...state.renderList,
    [action.value[0]]: {
      ...state.renderList[action.value[0]],
      audio: ToggleState.disabled,
      video: ToggleState.disabled,
      streamType: dualStreamMode === DualStreamMode.HIGH ? 'high' : 'low', // Low if DualStreamMode is LOW or DYNAMIC by default,
      ...typeData,
    },
  };
  let renderPosition = [...state.renderPosition, action.value[0]];
  const [maxUid] = renderPosition;
  if (renderPosition.length === 2 && maxUid === localUid) {
    //Only one remote and local is maximized
    //Change stream type to high if dualStreaMode is DYNAMIC
    if (dualStreamMode === DualStreamMode.DYNAMIC) {
      renderList[action.value[0]].streamType = 'high';
    }
    //Swap render positions
    stateUpdate = {
      renderList: renderList,
      renderPosition: renderPosition.reverse(),
    };
  } else {
    //More than one remote
    stateUpdate = {
      renderList: renderList,
      renderPosition: renderPosition,
    };
  }

  console.log('new user joined!\n', state, stateUpdate, {
    dualStreamMode,
  });
  return stateUpdate;
}
