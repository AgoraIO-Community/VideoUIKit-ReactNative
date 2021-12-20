import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext, {DispatchType} from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

function Recording() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {recording} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);

  return (
    <BtnTemplate
      name={'recording'}
      style={{...styles.localBtn, ...(recording as object)}}
      onPress={() => {}}
    />
  );
}

export default Recording;
