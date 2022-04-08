import {ToggleState, UidInterface} from '../../Contexts/PropsContext';
import {DispatchType} from '../../Contexts/RtcContext';
import RtcEngineType from 'react-native-agora';

const muteAudio = async (
  local: UidInterface,
  dispatch: DispatchType,
  RtcEngine: RtcEngineType,
) => {
  const localState = local.audio;
  // Don't do anything if it is in a transitional state
  if (
    localState === ToggleState.enabled ||
    localState === ToggleState.disabled
  ) {
    // Disable UI
    console.log('!dispatchLocalMuteAudio');
    dispatch({
      type: 'LocalMuteAudio',
      value: [
        localState === ToggleState.enabled
          ? ToggleState.disabling
          : ToggleState.enabling,
      ],
    });

    try {
      await RtcEngine.muteLocalAudioStream(localState === ToggleState.enabled);
      // Enable UI
      console.log('!LocalMuteAudioEnable');
      dispatch({
        type: 'LocalMuteAudio',
        value: [
          localState === ToggleState.enabled
            ? ToggleState.disabled
            : ToggleState.enabled,
        ],
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: 'LocalMuteAudio',
        value: [localState],
      });
    }
  } else {
    console.log('!localmute', local, ToggleState);
  }
};

export default muteAudio;
