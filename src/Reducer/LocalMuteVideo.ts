import {
  ActionType,
  ContentStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function LocalMuteVideo(
  state: ContentStateInterface,
  action: ActionType<'LocalMuteVideo'>,
  localUid: UidType,
) {
  let stateUpdate: Partial<ContentStateInterface> = {
    defaultContent: {
      ...state.defaultContent,
      [localUid]: {
        ...state.defaultContent[localUid],
        video: action.value[0],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
