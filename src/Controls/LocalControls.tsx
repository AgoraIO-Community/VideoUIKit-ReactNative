import React, {useContext} from 'react';
import {View} from 'react-native';
import styles from '../Style';
import EndCall from './Local/EndCall';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalVideoMute from './Local/LocalVideoMute';
import SwitchCamera from './Local/SwitchCamera';
import FullScreen from './Local/FullScreen';
import RemoteControls from './RemoteControls';
import {MaxUidConsumer} from '../Contexts/MaxUidContext';
import PropsContext from '../Contexts/PropsContext';
import LocalUserContextComponent from '../Contexts/LocalUserContext';

interface ControlsPropsInterface {
  showButton?: boolean;
}

function Controls(props: ControlsPropsInterface) {
  const {styleProps} = useContext(PropsContext);
  const {localBtnContainer} = styleProps || {};
  const showButton = props.showButton !== undefined ? props.showButton : true;
  return (
    <LocalUserContextComponent>
      <View style={{...styles.Controls, ...(localBtnContainer as object)}}>
        <LocalAudioMute />
        <LocalVideoMute />
        <EndCall />
        <SwitchCamera />
        <FullScreen />
      </View>
      {showButton ? (
        <MaxUidConsumer>
          {(users) => (
            <View
              style={{...styles.Controls, bottom: styles.Controls.bottom + 70}}>
              <RemoteControls user={users[0]} showRemoteSwap={false} />
            </View>
          )}
        </MaxUidConsumer>
      ) : (
        <></>
      )}
    </LocalUserContextComponent>
  );
}

export default Controls;
