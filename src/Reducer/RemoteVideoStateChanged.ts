import {ToggleState, UidInterface} from '../Contexts/PropsContext';
import {ActionType, UidStateInterface} from '../Contexts/RtcContext';

export default function RemoteVideoStateChanged(
  state: UidStateInterface,
  action: ActionType<'RemoteVideoStateChanged'>,
) {
  let stateUpdate = {};
  let videoState: ToggleState;
  if (action.value[1] === 0) {
    videoState = ToggleState.disabled;
  } else if (action.value[1] === 2) {
    videoState = ToggleState.enabled;
  }
  const videoChange = (user: UidInterface) => {
    if (user.uid === action.value[0] && videoState !== undefined) {
      user.video = videoState;
    }
    return user;
  };
  stateUpdate = {
    min: state.min.map(videoChange),
    max: state.max.map(videoChange),
  };
  return stateUpdate;
}
