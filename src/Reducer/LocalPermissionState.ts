import {
  ActionType,
  RenderStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function LocalPermissionState(
  state: RenderStateInterface,
  action: ActionType<'LocalPermissionState'>,
  localUid: UidType,
) {
  let stateUpdate: RenderStateInterface = {
    activeSpeaker: state.activeSpeaker,
    renderList: {
      ...state.renderList,
      [localUid]: {
        ...state.renderList[localUid],
        permissionStatus: action.value[0],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
