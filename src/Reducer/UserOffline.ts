import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function UserOffline(
  state: UidStateInterface,
  action: ActionType<'UserOffline'>,
) {
  let stateUpdate = {};
  if (state.max[0].uid === action.value[1]) {
    //If max has the remote video
    let minUpdate = [...state.min];
    stateUpdate = {
      max: [minUpdate.pop()],
      min: minUpdate,
    };
  } else {
    stateUpdate = {
      min: state.min.filter((user) => user.uid !== action.value[1]),
    };
  }
  return stateUpdate;
}
