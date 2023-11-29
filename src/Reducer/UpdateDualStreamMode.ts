import {DualStreamMode} from '../Contexts/PropsContext';
import {
  ActionType,
  ContentStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function UpdateDualStreamMode(
  state: ContentStateInterface,
  action: ActionType<'UpdateDualStreamMode'>,
) {
  const newMode = action.value[0];
  let defaultContent = {...state.defaultContent};
  let stateUpdate: Partial<ContentStateInterface>;
  const setHighStreamType = (uid: UidType) => {
    defaultContent[uid].streamType = 'high';
  };

  const setLowStreamType = (uid: UidType) => {
    defaultContent[uid].streamType = 'low';
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
    defaultContent: defaultContent,
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
