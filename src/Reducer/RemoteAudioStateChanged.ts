import {ToggleState} from '../Contexts/PropsContext';
import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function RemoteAudioStateChanged(
  state: ContentStateInterface,
  action: ActionType<'RemoteAudioStateChanged'>,
) {
  let audioState: ToggleState;
  if (action.value[1] === 2 || action.value[1] === 1) {
    audioState = ToggleState.enabled;
  } else {
    audioState = ToggleState.disabled;
  }

  const stateUpdate: ContentStateInterface = {
    activeSpeaker: state.activeSpeaker,
    defaultContent: {
      ...state.defaultContent,
      [action.value[0]]: {
        ...state.defaultContent[action.value[0]],
        audio: audioState,
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
