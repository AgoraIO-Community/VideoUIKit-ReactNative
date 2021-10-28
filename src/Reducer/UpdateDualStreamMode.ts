import {DualStreamMode, UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function UpdateDualStreamMode(
  state: UidStateInterface,
  action: ActionType<'UpdateDualStreamMode'>,
) {
  const newMode = action.value[0];
  let stateUpdate: UidStateInterface;
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
  } else {
    // if (newMode === DualStreamMode.DYNAMIC)
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
  return stateUpdate;
}
