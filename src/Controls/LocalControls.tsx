import React, {useContext} from 'react';
import {View} from 'react-native';
import styles from '../Style';
import EndCall from './Local/EndCall';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalVideoMute from './Local/LocalVideoMute';
import SwitchCamera from './Local/SwitchCamera';
import RemoteControls from './RemoteControls';
import {MaxUidConsumer} from '../Contexts/MaxUidContext';
import PropsContext, {ClientRole} from '../Contexts/PropsContext';

interface ControlsPropsInterface {
  showButton?: boolean;
}

function Controls(props: ControlsPropsInterface) {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {localBtnContainer} = styleProps || {};
  const showButton = props.showButton !== undefined ? props.showButton : true;
  return (
    <>
      <View style={{...styles.Controls, ...(localBtnContainer as object)}}>
        {rtcProps.role !== ClientRole.Audience && (
          <>
            <LocalAudioMute />
            <LocalVideoMute />
            <SwitchCamera />
          </>
        )}
        <EndCall />
      </View>
      {showButton ? (
        <MaxUidConsumer>
          {(users) => (
            <View style={{...styles.Controls, top: styles.Controls.top - 100}}>
              <RemoteControls user={users[0]} showRemoteSwap={false} />
            </View>
          )}
        </MaxUidConsumer>
      ) : (
        <></>
      )}
    </>
  );
}

export default Controls;
