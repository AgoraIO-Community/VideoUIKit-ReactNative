import {UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function LocalMuteVideo(
  state: UidStateInterface,
  action: ActionType<'LocalMuteVideo'>,
) {
  let stateUpdate = {};
  const LocalVideoMute = (user: UidInterface) => {
    if (user.uid === 'local') {
      user.video = action.value[0];
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(LocalVideoMute),
    max: state.max.map(LocalVideoMute),
  };
  return stateUpdate;
}
