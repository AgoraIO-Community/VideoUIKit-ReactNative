import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

function Recording() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {recording} = localBtnStyles || {};

  return (
    <BtnTemplate
      name={'recording'}
      style={{...styles.localBtn, ...(recording as object)}}
      onPress={() => {}}
    />
  );
}

export default Recording;
