import React, {useContext} from 'react';
import {View} from 'react-native';
import styles from '../Style';
import EndCall from './Local/EndCall';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalVideoMute from './Local/LocalVideoMute';
import SwitchCamera from './Local/SwitchCamera';
import RemoteControls from './RemoteControls';
import {ContentConsumer} from '../Contexts/ContentContext';
import PropsContext from '../Contexts/PropsContext';
import LocalUserContextComponent from '../Contexts/LocalUserContext';
import useLocalUid from '../Utils/useLocalUid';

interface ControlsPropsInterface {
  showButton?: boolean;
}

function Controls(props: ControlsPropsInterface) {
  const {styleProps} = useContext(PropsContext);
  const localUid = useLocalUid();
  const {localBtnContainer} = styleProps || {};
  const showButton = props.showButton !== undefined ? props.showButton : true;
  return (
    <LocalUserContextComponent localUid={localUid}>
      <View style={{...styles.Controls, ...(localBtnContainer as object)}}>
        <LocalAudioMute />
        <LocalVideoMute />
        <SwitchCamera />
        <EndCall />
      </View>
      {showButton ? (
        <ContentConsumer>
          {({defaultContent, activeUids}) => (
            <View style={{...styles.Controls, top: styles.Controls.top - 100}}>
              <RemoteControls
                user={defaultContent[activeUids[0]]}
                showRemoteSwap={false}
              />
            </View>
          )}
        </ContentConsumer>
      ) : (
        <></>
      )}
    </LocalUserContextComponent>
  );
}

export default Controls;
