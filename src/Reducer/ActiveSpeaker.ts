import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function ActiveSpeaker(
  state: ContentStateInterface,
  action: ActionType<'ActiveSpeaker'>,
) {
  let localActiveUids = [...state.activeUids];
  let pinnedUid = state.pinnedUid;
  let secondaryPinnedUid = state.secondaryPinnedUid;
  const activeSpeaker =
    action?.value && action.value?.length ? action.value[0] : 0;
  if (activeSpeaker) {
    const filteredData = localActiveUids?.filter((i) => i !== activeSpeaker);
    const [first, second, ...remaining] = filteredData;
    if (pinnedUid && secondaryPinnedUid) {
      localActiveUids = [first, second, activeSpeaker, ...remaining];
    } else if (pinnedUid && !secondaryPinnedUid) {
      localActiveUids = [first, activeSpeaker, second, ...remaining];
    } else if (!pinnedUid && secondaryPinnedUid) {
      localActiveUids = [activeSpeaker, second, first, ...remaining];
    } else {
      localActiveUids = [activeSpeaker, first, second, ...remaining];
    }
    console.log('debugging activeSpeaker ', activeSpeaker, localActiveUids);
  }
  return {
    ...state,
    activeUids: localActiveUids,
  };
}
