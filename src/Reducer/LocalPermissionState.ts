import {
  ActionType,
  ContentStateInterface,
  UidType,
} from '../Contexts/RtcContext';

export default function LocalPermissionState(
  state: ContentStateInterface,
  action: ActionType<'LocalPermissionState'>,
  localUid: UidType,
) {
  let stateUpdate: Partial<ContentStateInterface> = {
    defaultContent: {
      ...state.defaultContent,
      [localUid]: {
        ...state.defaultContent[localUid],
        permissionStatus: action.value[0],
      },
    },
    activeUids: [...state.activeUids],
  };
  return stateUpdate;
}
