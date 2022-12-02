import {
  ActionType,
  RenderStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function LocalMuteVideo(
  state: RenderStateInterface,
  action: ActionType<'LocalMuteVideo'>,
  localUid: UidType,
) {
  let stateUpdate: RenderStateInterface = {
    activeSpeaker: state.activeSpeaker,
    renderList: {
      ...state.renderList,
      [localUid]: {
        ...state.renderList[localUid],
        video: action.value[0],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
