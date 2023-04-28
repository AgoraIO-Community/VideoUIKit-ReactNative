import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function UserPin(
  state: ContentStateInterface,
  action: ActionType<'UserPin'>,
) {
  return {
    ...state,
    pinnedUid: action?.value && action.value?.length ? action.value[0] : '',
  };
}
