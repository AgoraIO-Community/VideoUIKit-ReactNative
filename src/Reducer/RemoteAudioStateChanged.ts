import {ToggleState, UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function RemoteAudioStateChanged(
  state: UidStateInterface,
  action: ActionType<'RemoteAudioStateChanged'>,
) {
  let stateUpdate = {};
  let audioState: ToggleState;
  if (action.value[1] === 2 || action.value[1] === 1) {
    audioState = ToggleState.enabled;
  } else {
    audioState = ToggleState.disabled;
  }
  const audioChange = (user: UidInterface) => {
    if (user.uid === action.value[0]) {
      user.audio = audioState;
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(audioChange),
    max: state.max.map(audioChange),
  };
  return stateUpdate;
}
