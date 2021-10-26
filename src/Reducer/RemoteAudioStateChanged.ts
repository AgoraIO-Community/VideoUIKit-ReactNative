import {ToggleState, UidInterface} from 'src/Contexts/PropsContext';
import {ActionType, UidStateInterface} from 'src/Contexts/RtcContext';

export default function RemoteAudioStateChanged(
  state: UidStateInterface,
  action: ActionType<'RemoteAudioStateChanged'>,
) {
  let stateUpdate = {};
  let audioState: ToggleState;
  if (action.value[1] === 0) {
    audioState = ToggleState.disabled;
  } else if (action.value[1] === 2) {
    audioState = ToggleState.enabled;
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
