import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function UserMuteRemoteVideo(
  state: ContentStateInterface,
  action: ActionType<'UserMuteRemoteVideo'>,
) {
  let stateUpdate: ContentStateInterface = {
    activeSpeaker: state.activeSpeaker,
    defaultContent: {
      ...state.defaultContent,
      [action.value[0]]: {
        ...state.defaultContent[action.value[0]],
        video: action.value[1],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
