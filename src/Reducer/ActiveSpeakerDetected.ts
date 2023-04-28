import {ActionType, ContentStateInterface} from '../Contexts/RtcContext';

export default function ActiveSpeakerDetected(
  state: ContentStateInterface,
  action: ActionType<'ActiveSpeakerDetected'>,
) {
  return {
    ...state,
    activeSpeaker: action?.value && action.value?.length ? action.value[0] : '',
  };
}
