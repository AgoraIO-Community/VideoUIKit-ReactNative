import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function UserMuteRemoteAudio(
  state: RenderStateInterface,
  action: ActionType<'UserMuteRemoteAudio'>,
) {
  let stateUpdate: RenderStateInterface = {
    renderList: {
      ...state.renderList,
      [action.value[0]]: {
        ...state.renderList[action.value[0]],
        audio: action.value[1],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
