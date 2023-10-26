import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function UserSecondaryPin(
  state: ContentStateInterface,
  action: ActionType<'UserSecondaryPin'>,
) {
  let localActiveUids = [...state.activeUids];
  const secondaryPinnedUid =
    action?.value && action.value?.length ? action.value[0] : 0;
  if (secondaryPinnedUid) {
    const filteredData: any = localActiveUids?.filter(
      (i) => i !== secondaryPinnedUid,
    );
    const [maxUid, ...minUids] = filteredData;
    localActiveUids = [maxUid, secondaryPinnedUid, ...minUids];
  }
  return {
    ...state,
    secondaryPinnedUid,
    pinnedUid: state?.pinnedUid === secondaryPinnedUid ? 0 : state?.pinnedUid,
    activeUids: localActiveUids,
  };
}
