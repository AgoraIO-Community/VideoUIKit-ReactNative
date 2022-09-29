import {
  ActionType,
  RenderStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function LocalMuteAudio(
  state: RenderStateInterface,
  action: ActionType<'LocalMuteAudio'>,
  localUid: UidType,
) {
  let stateUpdate: RenderStateInterface = {
    renderList: {
      ...state.renderList,
      [localUid]: {
        ...state.renderList[localUid],
        audio: action.value[0],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
