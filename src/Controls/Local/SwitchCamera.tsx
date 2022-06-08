import React, {useContext} from 'react';
import PropsContext,{ToggleState} from '../../Contexts/PropsContext';
import {LocalContext} from '../../Contexts/LocalUserContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

interface Props{
  btnText?: string
}

function SwitchCamera(props?: Props) {
  const {styleProps, callbacks} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {switchCamera} = localBtnStyles || {};
  const {RtcEngine} = useContext(RtcContext);
  const local = useContext(LocalContext);
  return (
    <BtnTemplate
      name={'switchCamera'}
      style={{...styles.localBtn, ...(switchCamera as object)}}
      btnText={props?.btnText ||'Switch'}
      disabled={local.video === ToggleState.enabled ? false : true}
      onPress={() => {
        RtcEngine.switchCamera();
        callbacks?.SwitchCamera && callbacks.SwitchCamera();
      }}
    />
  );
}

export default SwitchCamera;
