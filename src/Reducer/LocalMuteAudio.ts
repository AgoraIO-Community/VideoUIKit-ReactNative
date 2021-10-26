import {UidInterface} from 'src/Contexts/PropsContext';
import {ActionType, UidStateInterface} from 'src/Contexts/RtcContext';

export default function LocalMuteAudio(
  state: UidStateInterface,
  action: ActionType<'LocalMuteAudio'>,
) {
  let stateUpdate = {};
  const LocalAudioMute = (user: UidInterface) => {
    if (user.uid === 'local') {
      user.audio = action.value[0];
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(LocalAudioMute),
    max: state.max.map(LocalAudioMute),
  };
  return stateUpdate;
}
