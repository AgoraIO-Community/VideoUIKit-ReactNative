import {RemoteAudioState} from 'react-native-agora';
import {ToggleState, UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function RemoteAudioStateChanged(
  state: UidStateInterface,
  action: ActionType<'RemoteAudioStateChanged'>,
) {
  let stateUpdate = {};
  let audioState: ToggleState;
  if (
    action.value[2] === RemoteAudioState.RemoteAudioStateStarting ||
    action.value[2] === RemoteAudioState.RemoteAudioStateDecoding
  ) {
    audioState = ToggleState.enabled;
  } else {
    audioState = ToggleState.disabled;
  }
  const audioChange = (user: UidInterface) => {
    if (user.uid === action.value[1]) {
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
