import {ToggleState} from '../Contexts/PropsContext';
import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function RemoteAudioStateChanged(
  state: RenderStateInterface,
  action: ActionType<'RemoteAudioStateChanged'>,
) {
  let audioState: ToggleState;
  if (action.value[1] === 2 || action.value[1] === 1) {
    audioState = ToggleState.enabled;
  } else {
    audioState = ToggleState.disabled;
  }

  const stateUpdate: RenderStateInterface = {
    renderList: {
      ...state.renderList,
      [action.value[0]]: {
        ...state.renderList[action.value[0]],
        audio: audioState,
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
