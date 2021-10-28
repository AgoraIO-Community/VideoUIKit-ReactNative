import {UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function UserMuteRemoteAudio(
  state: UidStateInterface,
  action: ActionType<'UserMuteRemoteAudio'>,
) {
  let stateUpdate = {};
  const audioMute = (user: UidInterface) => {
    if (user.uid === action.value[0].uid) {
      user.audio = action.value[1];
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(audioMute),
    max: state.max.map(audioMute),
  };
  return stateUpdate;
}
