import {DualStreamMode, ToggleState} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function UserJoined(
  state: UidStateInterface,
  action: ActionType<'UserJoined'>,
  dualStreamMode: DualStreamMode,
  uids: (string | number)[],
) {
  let stateUpdate = {};
  if (uids.indexOf(action.value[0]) === -1) {
    //If new user has joined
    //By default add to minimized
    let minUpdate = [
      ...state.min,
      {
        uid: action.value[0],
        audio: ToggleState.disabled,
        video: ToggleState.disabled,
        streamType: dualStreamMode === DualStreamMode.HIGH ? 'high' : 'low', // Low if DualStreamMode is LOW or DYNAMIC by default
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

    // console.log('new user joined!\n', state, stateUpdate, {
    //   dualStreamMode,
    // });
  }
  return stateUpdate;
}
