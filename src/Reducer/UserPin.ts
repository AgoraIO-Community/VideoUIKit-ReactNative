import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function UserPin(
  state: RenderStateInterface,
  action: ActionType<'UserPin'>,
) {
  return {
    ...state,
    pinnedUid: action?.value && action.value?.length ? action.value[0] : '',
  };
}
