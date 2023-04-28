import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function UserMuteRemoteAudio(
  state: ContentStateInterface,
  action: ActionType<'UserMuteRemoteAudio'>,
) {
  let stateUpdate: ContentStateInterface = {
    activeSpeaker: state.activeSpeaker,
    defaultContent: {
      ...state.defaultContent,
      [action.value[0]]: {
        ...state.defaultContent[action.value[0]],
        audio: action.value[1],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
