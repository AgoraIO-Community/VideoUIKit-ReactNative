import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function UserOffline(
  state: ContentStateInterface,
  action: ActionType<'UserOffline'>,
) {
  // let updatedRenderList = {
  //   ...state.defaultContent,
  // };
  // //don't delete user data from renderlist
  // //we will update user data with {offline:true} from RTM user left event
  // if (updatedRenderList[action.value[0]]) {
  //   delete updatedRenderList[action.value[0]];
  // }
  const updatedActiveUids = [...state.activeUids].filter(
    (uid) => uid !== action.value[0],
  );
  const stateUpdate: Partial<ContentStateInterface> = {
    defaultContent: state.defaultContent,
    activeUids: updatedActiveUids,
    pinnedUid:
      state?.pinnedUid && updatedActiveUids?.indexOf(state.pinnedUid) !== -1
        ? state.pinnedUid
        : 0,
    secondaryPinnedUid:
      state?.secondaryPinnedUid &&
      updatedActiveUids?.indexOf(state.secondaryPinnedUid) !== -1
        ? state.secondaryPinnedUid
        : 0,
  };

  return stateUpdate;
}
