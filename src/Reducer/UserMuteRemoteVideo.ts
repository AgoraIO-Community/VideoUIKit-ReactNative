import {UidInterface} from 'src/Contexts/PropsContext';
import {ActionType, UidStateInterface} from 'src/Contexts/RtcContext';

export default function UserMuteRemoteVideo(
  state: UidStateInterface,
  action: ActionType<'UserMuteRemoteVideo'>,
) {
  let stateUpdate = {};
  const videoMute = (user: UidInterface) => {
    if (user.uid === action.value[0].uid) {
      user.video = action.value[1];
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(videoMute),
    max: state.max.map(videoMute),
  };
  return stateUpdate;
}
