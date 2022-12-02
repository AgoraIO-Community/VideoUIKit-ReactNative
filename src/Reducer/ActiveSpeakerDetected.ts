import {ActionType, RenderStateInterface} from '../Contexts/RtcContext';

export default function ActiveSpeakerDetected(
  state: RenderStateInterface,
  action: ActionType<'ActiveSpeakerDetected'>,
) {
  return {
    ...state,
    activeSpeaker: action?.value && action.value?.length ? action.value[0] : '',
  };
}
