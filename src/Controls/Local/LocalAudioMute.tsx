import React, {useContext} from 'react';
import PropsContext, {ToggleState} from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../Contexts/LocalUserContext';

interface Props {
  btnText?: string;
  variant?: 'outlined' | 'text';
}
function LocalAudioMute(props: Props) {
  const {btnText = 'Audio', variant = 'Outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalAudio} = localBtnStyles || {};
  const {muteRemoteAudio} = remoteBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return (
    <BtnTemplate
      name={local.audio === ToggleState.enabled ? 'mic' : 'micOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'Outlined'
          ? (muteLocalAudio as object)
          : (muteRemoteAudio as object)),
      }}
      onPress={async () => {
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
            await RtcEngine.muteLocalAudioStream(
              localState === ToggleState.enabled,
            );
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
        }
      }}
    />
  );
}

export default LocalAudioMute;
