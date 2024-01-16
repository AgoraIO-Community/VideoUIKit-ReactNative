import React, { useContext } from 'react';
import { IRtcEngine } from 'react-native-agora';
import { LocalContext } from '../../Contexts/LocalUserContext';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtcContext, { DispatchType } from '../../Contexts/RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';
interface LocalAudioMuteProps {
  btnText?: string;
  variant?: 'outlined' | 'text';
}

const LocalAudioMute: React.FC<LocalAudioMuteProps> = (props) => {
  const {btnText = 'Audio', variant = 'outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalAudio, unmuteLocalAudio} = localBtnStyles || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const localUser = useContext(LocalContext);

  const customStyle = localUser.audio === ToggleState.disabled && unmuteLocalAudio ? unmuteLocalAudio : muteLocalAudio;


  return (
    <BtnTemplate
      name={localUser.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'outlined'
          ? (customStyle as object)
          : (muteRemoteAudio as object)),
      }}
      onPress={() => muteAudio(localUser, dispatch, RtcEngine)}
    />
  );
};

export const muteAudio = async (
  local: UidInterface,
  dispatch: DispatchType,
  RtcEngine: IRtcEngine,
) => {
  const localState = local.audio;
  // Don't do anything if it is in a transitional state
  if (
    localState === ToggleState.enabled ||
    localState === ToggleState.disabled
  ) {
    // Disable UI
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
    console.log('LocalMuteAudio in transition', local, ToggleState);
  }
};

export default LocalAudioMute;
