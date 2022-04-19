import React, {useContext} from 'react';
import PropsContext, {ToggleState} from '../../Contexts/PropsContext';
import RtmContext, {popUpStateEnum} from '../../Contexts/RtmContext';
import RtcContext from '../../Contexts/RtcContext';
import {muteVideo} from '../Local/LocalVideoMute';
import {LocalContext} from '../../Contexts/LocalUserContext';
import {muteAudio} from '../Local/LocalAudioMute';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function PopUp() {
  const {styleProps} = useContext(PropsContext);
  const {popUpState, setPopUpState} = useContext(RtmContext || {});
  const {popUpContainer} = styleProps || {};
  const {dispatch, RtcEngine} = useContext(RtcContext);
  const local = useContext(LocalContext);

  return popUpState !== popUpStateEnum.closed ? (
    <View style={[styles.container, popUpContainer]}>
      <Text style={styles.fontStyle}>
        {popUpState === popUpStateEnum.muteCamera ||
        popUpState === popUpStateEnum.muteMic
          ? 'Mute '
          : 'Unmute '}
        {popUpState === popUpStateEnum.muteCamera ||
        popUpState === popUpStateEnum.unmuteCamera
          ? 'Camera'
          : 'Mic'}
        ?
      </Text>
      <View style={styles.buttonHolder}>
        <TouchableOpacity
          onPress={() => {
            switch (popUpState) {
              case popUpStateEnum.muteCamera:
                local.video === ToggleState.enabled &&
                  muteVideo(local, dispatch, RtcEngine);
                break;
              case popUpStateEnum.muteMic:
                local.audio === ToggleState.enabled &&
                  muteAudio(local, dispatch, RtcEngine);
                break;
              case popUpStateEnum.unmuteCamera:
                local.video === ToggleState.disabled &&
                  muteVideo(local, dispatch, RtcEngine);
                break;
              case popUpStateEnum.unmuteMic:
                local.audio === ToggleState.disabled &&
                  muteAudio(local, dispatch, RtcEngine);
                break;
            }
            setPopUpState(popUpStateEnum.closed);
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonClose}
          onPress={() => setPopUpState(popUpStateEnum.closed)}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  button: {
    color: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    padding: 2,
    borderRadius: 4,
  },
  buttonClose: {
    color: '#fff',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
    padding: 2,
    borderRadius: 4,
  },
  container: {
    backgroundColor: '#007bffaa',
    position: 'absolute',
    width: 240,
    height: 80,
    top: Dimensions.get('screen').height / 2 - 80,
    left: Dimensions.get('screen').width / 2 - 120,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  fontStyle: {color: '#fff', fontWeight: '700', fontSize: 18},
  buttonText: {color: '#fff', paddingHorizontal: 8},
  buttonHolder: {
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default PopUp;
