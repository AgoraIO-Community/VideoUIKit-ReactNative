import React, { useContext } from 'react';
import { LocalContext } from '../../Contexts/LocalUserContext';
import PropsContext from '../../Contexts/PropsContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

const FullScreen: React.FC = () => {
  const {styleProps, callbacks} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {fullScreen} = localBtnStyles || {};
  const local = useContext(LocalContext);
  return (
    <BtnTemplate
      name={'fullScreen'}
      style={{...styles.localBtn, ...(fullScreen as object)}}
      btnText={'Full Screen'}
      onPress={() => {
        console.log('expanding')
      }}
    />
  );
};

export default FullScreen;
