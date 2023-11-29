import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import DispatchContext from '../../Contexts/DispatchContext';

function FullScreen() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {fullScreen} = localBtnStyles || {};
  const {dispatch} = useContext(DispatchContext);
  return (
    <BtnTemplate
      //@ts-ignore
      name={'fullscreen'}
      style={{...styles.localBtn, ...(fullScreen as object)}}
      onPress={() => {
        dispatch({
          type: 'FullScreen',
          value: [],
        });
      }}
    />
  );
}

export default FullScreen;
