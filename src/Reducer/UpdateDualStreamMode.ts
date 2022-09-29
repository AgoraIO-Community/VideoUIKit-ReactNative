import {DualStreamMode} from '../Contexts/PropsContext';
import {
  ActionType,
  RenderStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function UpdateDualStreamMode(
  state: RenderStateInterface,
  action: ActionType<'UpdateDualStreamMode'>,
) {
  const newMode = action.value[0];
  let renderList = {...state.renderList};
  let stateUpdate: RenderStateInterface;
  const setHighStreamType = (uid: UidType) => {
    renderList[uid].streamType = 'high';
  };

  const setLowStreamType = (uid: UidType) => {
    renderList[uid].streamType = 'low';
  };

  if (newMode === DualStreamMode.HIGH) {
    // Update everybody to high
    state.activeUids.forEach(setHighStreamType);
  } else if (newMode === DualStreamMode.LOW) {
    // Update everybody to low
    state.activeUids.forEach(setLowStreamType);
  } else {
    const [maxUid, ...minUids] = state.activeUids;
    // if (newMode === DualStreamMode.DYNAMIC)
    // Max users are high other are low
    //setting high for maxuid
    setHighStreamType(maxUid);
    //setting low for minuids
    minUids.forEach(setLowStreamType);
  }
  stateUpdate = {
    renderList: renderList,
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
