import React, { useContext } from 'react';
import PropsContext from '../../Contexts/PropsContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

interface FullScreenProps {
  onPress?: (_: boolean) => void
}

const FullScreen: React.FC<FullScreenProps> = (props) => {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {fullScreen} = localBtnStyles || {};
  return (
    <BtnTemplate
      name={'fullScreen'}
      style={{...styles.localBtn, ...(fullScreen as object)}}
      btnText={'Full Screen'}
      onPress={() => {
        props.onPress
        console.log('pressing')
      }}
    />
  );
};

export default FullScreen;
