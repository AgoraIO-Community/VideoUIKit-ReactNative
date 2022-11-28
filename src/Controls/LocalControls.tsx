import React, { useContext } from 'react';
import { View } from 'react-native';
import { MaxUidConsumer } from '../Contexts/MaxUidContext';
import PropsContext, { ClientRole, Layout } from '../Contexts/PropsContext';
import styles from '../Style';
import EndCall from './Local/EndCall';
import FullScreen from './Local/FullScreen';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalVideoMute from './Local/LocalVideoMute';
import SwitchCamera from './Local/SwitchCamera';
import Timer from './Local/Timer';
import RemoteControls from './RemoteControls';

interface ControlsPropsInterface {
  showButton?: boolean;
}

const Controls: React.FC<ControlsPropsInterface> = (props) => {
  const {styleProps, rtcProps } = useContext(PropsContext);
  const {localBtnContainer, showTimer = false} = styleProps || {};
  const showButton = props.showButton !== undefined ? props.showButton : true;
  return (
    <>
      <View style={{...styles.Controls, ...(localBtnContainer as object)}}>
        {rtcProps.role !== ClientRole.Audience && (
          <>
            {showTimer && <Timer />}
            <LocalAudioMute />
            <LocalVideoMute />
            <FullScreen />
            <SwitchCamera />
          </>
        )}
        <EndCall />
      </View>
      {showButton ? (
        <MaxUidConsumer>
          {(users) => (
            <View
              style={{
                ...styles.Controls,
                bottom: styles.Controls.bottom + 70,
              }}>
              {rtcProps.layout !== Layout.Grid && (
                <RemoteControls user={users[0]} showRemoteSwap={false} />
              )}
            </View>
          )}
        </MaxUidConsumer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Controls;
