import {ToggleState} from '../Contexts/PropsContext';
import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function RemoteVideoStateChanged(
  state: ContentStateInterface,
  action: ActionType<'RemoteVideoStateChanged'>,
) {
  let videoState: ToggleState;
  if (action.value[1] === 0) {
    videoState = ToggleState.disabled;
  } else if (action.value[1] === 2) {
    videoState = ToggleState.enabled;
  }

  const stateUpdate: Partial<ContentStateInterface> = {
    defaultContent: {
      ...state.defaultContent,
      [action.value[0] as unknown as number]: {
        ...state.defaultContent[action.value[0] as unknown as number],
        video:
          //@ts-ignore
          videoState !== undefined
            ? videoState
            : state.defaultContent[action.value[0] as unknown as number].video,
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
