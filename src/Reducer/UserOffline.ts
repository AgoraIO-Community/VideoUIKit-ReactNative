import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function UserOffline(
  state: RenderStateInterface,
  action: ActionType<'UserOffline'>,
) {
  // let updatedRenderList = {
  //   ...state.renderList,
  // };
  // //don't delete user data from renderlist
  // //we will update user data with {offline:true} from RTM user left event
  // if (updatedRenderList[action.value[0]]) {
  //   delete updatedRenderList[action.value[0]];
  // }
  const updatedActiveUids = [...state.activeUids].filter(
    (uid) => uid !== action.value[0],
  );
  const stateUpdate: RenderStateInterface = {
    renderList: state.renderList,
    activeUids: updatedActiveUids,
  };

  return stateUpdate;
}
