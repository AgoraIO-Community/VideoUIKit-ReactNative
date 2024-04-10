import {
  ActionType,
  ContentStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function LocalMuteAudio(
  state: ContentStateInterface,
  action: ActionType<'LocalMuteAudio'>,
  localUid: UidType,
) {
  let stateUpdate: Partial<ContentStateInterface> = {
    defaultContent: {
      ...state.defaultContent,
      [localUid]: {
        ...state.defaultContent[localUid],
        audio: action.value[0],
        audioForceDisabled:
          action?.value?.length === 2 ? action.value[1] : false,
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
