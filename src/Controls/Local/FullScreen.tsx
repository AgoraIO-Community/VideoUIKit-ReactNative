import React, { useContext, useState } from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';



const FullScreen: React.FC = () => {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {fullScreen} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  const [localState, setLocalState] = useState('normal')

  return (
    <BtnTemplate
      name={'fullScreen'}
      style={{...styles.localBtn, ...(fullScreen as object)}}
      btnText={'Full Screen'}
      onPress={() => {
        if ( localState === 'full') {
          dispatch({
            type: 'NormalScreen',
            value: []
          });
          setLocalState('normal');
        } else {
          dispatch({
            type: 'FullScreen',
            value: [],
          });
          setLocalState('full');
        }
      }}
    />
  );
};

export default FullScreen;
