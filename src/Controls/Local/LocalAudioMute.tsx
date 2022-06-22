import React, {useContext} from 'react';
import PropsContext, {
  ToggleState,
  UidInterface,
} from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../Contexts/LocalUserContext';
import {DispatchType} from '../../Contexts/RtcContext';
import RtcEngineType from 'react-native-agora';
interface LocalAudioMuteProps {
  btnText?: string;
  variant?: 'outlined' | 'text';
}

const LocalAudioMute: React.FC<LocalAudioMuteProps> = (props) => {
  const {btnText = 'Audio', variant = 'Outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalAudio} = localBtnStyles || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const localUser = useContext(LocalContext);

  return (
    <BtnTemplate
      name={localUser.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'Outlined'
          ? (muteLocalAudio as object)
          : (muteRemoteAudio as object)),
      }}
      onPress={() => muteAudio(localUser, dispatch, RtcEngine)}
    />
  );
};

export const muteAudio = async (
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
