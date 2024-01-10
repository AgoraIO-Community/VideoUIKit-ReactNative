import React, { useContext, useState } from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import styles from '../../Style';
import BtnTemplate from '../BtnTemplate';

/**
 * React Component that renders the endcall button
 * @returns Renders the endcall button
 */
const FullScreen: React.FC = () => {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {fullScreen} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);
  const [action, setAction] = useState('fullScreen')

  const onPress = () => {
    if (action === 'fullScreen') {
      console.log('pressing fullscreen')
      dispatch({
        type: 'FullScreen',
        value: [],
      })
      setAction('normal')
    }
    if (action === 'normal') {
      console.log('pressing normal')
      dispatch({
        type: 'NormalScreen',
        value: [],
      })
      setAction('fullScreen')
    }
  }


  return (
    <BtnTemplate
      name={'fullScreen'} //or normalScreen
      btnText={'Full Screen'}
      style={{...styles.localBtn, ...(fullScreen as object)}}
      onPress={onPress}
    />
  );
};

export default FullScreen;
