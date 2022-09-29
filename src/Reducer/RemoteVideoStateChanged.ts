import {ToggleState} from '../Contexts/PropsContext';
import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function RemoteVideoStateChanged(
  state: RenderStateInterface,
  action: ActionType<'RemoteVideoStateChanged'>,
) {
  let videoState: ToggleState;
  if (action.value[1] === 0) {
    videoState = ToggleState.disabled;
  } else if (action.value[1] === 2) {
    videoState = ToggleState.enabled;
  }

  const stateUpdate: RenderStateInterface = {
    renderList: {
      ...state.renderList,
      [action.value[0]]: {
        ...state.renderList[action.value[0]],
        video:
          videoState !== undefined
            ? videoState
            : state.renderList[action.value[0]].video,
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
