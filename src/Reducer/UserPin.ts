import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function UserPin(
  state: ContentStateInterface,
  action: ActionType<'UserPin'>,
) {
  let localActiveUids = [...state.activeUids];
  let secondaryPinnedUid = state.secondaryPinnedUid;
  const pinnedUid =
    action?.value && action.value?.length ? action.value[0] : '';
  if (pinnedUid) {
    const filteredData = localActiveUids?.filter(
      (i) => i !== pinnedUid && i !== secondaryPinnedUid,
    );
    if (secondaryPinnedUid && secondaryPinnedUid !== pinnedUid) {
      filteredData.unshift(secondaryPinnedUid);
    }
    filteredData.unshift(pinnedUid);
    localActiveUids = filteredData;
  }
  return {
    ...state,
    pinnedUid,
    secondaryPinnedUid:
      pinnedUid === secondaryPinnedUid ? 0 : secondaryPinnedUid,
    activeUids: localActiveUids,
  };
}
