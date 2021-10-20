import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext, {DispatchType} from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

function Screenshare() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {screenshare} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);

  return (
    <BtnTemplate
      name={'screenshare'}
      style={{...styles.localBtn, ...(screenshare as object)}}
      onPress={() => {}}
    />
  );
}

export default Screenshare;
