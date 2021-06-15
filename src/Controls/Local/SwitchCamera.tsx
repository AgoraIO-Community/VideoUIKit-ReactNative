import React, {useContext} from 'react';
import PropsContext from '../../PropsContext';
import RtcContext, {DispatchType} from '../../RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

function SwitchCamera() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {switchCamera} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  return (
    <BtnTemplate
      name={'switchCamera'}
      style={{...styles.localBtn, ...(switchCamera as object)}}
      btnText={'Switch'}
      onPress={() => {
        // RtcEngine.switchCamera();
        (dispatch as DispatchType<'SwitchCamera'>)({
          type: 'SwitchCamera',
          value: [],
        });
      }}
    />
  );
}

export default SwitchCamera;
