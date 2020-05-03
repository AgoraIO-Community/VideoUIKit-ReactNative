import React, {useContext} from 'react';
import {View} from 'react-native';
import styles from '../Style';
import EndCall from './Local/EndCall';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalVideoMute from './Local/LocalVideoMute';
import SwitchCamera from './Local/SwitchCamera';
import FullScreen from './Local/FullScreen';
import RemoteControls from './RemoteControls';
import {MaxUidConsumer} from '../MaxUidContext';
import PropsContext from '../PropsContext';
import LocalUserContextComponent from '../LocalUserContext';

function Controls() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnContainer} = styleProps || {};
  return (
    <LocalUserContextComponent>
      <View style={{...styles.Controls, ...(localBtnContainer as object)}}>
        <LocalAudioMute />
        <LocalVideoMute />
        <EndCall />
        <SwitchCamera />
        <FullScreen />
      </View>
      <MaxUidConsumer>
        {(users) => (
          <View
            style={{...styles.Controls, bottom: styles.Controls.bottom + 70}}>
            <RemoteControls user={users[0]} showRemoteSwap={false} />
          </View>
        )}
      </MaxUidConsumer>
    </LocalUserContextComponent>
  );
}

export default Controls;
