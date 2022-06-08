import React, {useContext} from 'react';
import PropsContext, {ToggleState} from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import {LocalContext} from '../../Contexts/LocalUserContext';

interface LocalVideoMuteProps {
  btnText?: string;
  variant?: 'outlined' | 'text';
}

function LocalVideoMute(props: LocalVideoMuteProps) {
  const {btnText = 'Video', variant = 'Outlined'} = props;
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles, remoteBtnStyles} = styleProps || {};
  const {muteLocalVideo} = localBtnStyles || {};
  const {muteRemoteVideo} = remoteBtnStyles || {};
  const {RtcEngine, dispatch} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return (
    <BtnTemplate
      name={local.video === ToggleState.enabled ? 'videocam' : 'videocamOff'}
      btnText={btnText}
      style={{
        ...styles.localBtn,
        ...(variant === 'Outlined'
          ? (muteLocalVideo as object)
          : (muteRemoteVideo as object)),
      }}
      onPress={async () => {
        const localState = local.video;
        // Don't do anything if it is in a transitional state
        if (
          localState === ToggleState.enabled ||
          localState === ToggleState.disabled
        ) {
          // Disable UI
          dispatch({
            type: 'LocalMuteVideo',
            value: [
              localState === ToggleState.enabled
                ? ToggleState.disabling
                : ToggleState.enabling,
            ],
          });

          try {
            await RtcEngine.muteLocalVideoStream(
              localState === ToggleState.enabled ? true : false,
            );
            console.log('muted video', localState);
            // Enable UI
            dispatch({
              type: 'LocalMuteVideo',
              value: [
                localState === ToggleState.enabled
                  ? ToggleState.disabled
                  : ToggleState.enabled,
              ],
            });
          } catch (e) {
            console.log('error while dispatching');
            dispatch({
              type: 'LocalMuteVideo',
              value: [localState],
            });
          }
        }
      }}
    />
  );
}

export default LocalVideoMute;
