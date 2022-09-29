import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function UserMuteRemoteVideo(
  state: RenderStateInterface,
  action: ActionType<'UserMuteRemoteVideo'>,
) {
  let stateUpdate: RenderStateInterface = {
    renderList: {
      ...state.renderList,
      [action.value[0]]: {
        ...state.renderList[action.value[0]],
        video: action.value[1],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
