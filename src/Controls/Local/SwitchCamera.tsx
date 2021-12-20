import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

function SwitchCamera() {
  const {styleProps, callbacks} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {switchCamera} = localBtnStyles || {};
  const {RtcEngine} = useContext(RtcContext);
  return (
    <BtnTemplate
      name={'switchCamera'}
      style={{...styles.localBtn, ...(switchCamera as object)}}
      btnText={'Switch'}
      onPress={() => {
        RtcEngine.switchCamera();
        callbacks?.SwitchCamera && callbacks.SwitchCamera();
      }}
    />
  );
}

export default SwitchCamera;
