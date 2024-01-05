import React, { useContext } from 'react';
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

  return (
    <BtnTemplate
      name={'fullScreen'} //or normalScreen
      btnText={'Full Screen'}
      style={{...styles.localBtn, ...(fullScreen as object)}}
      onPress={() =>
        dispatch({
          type: 'FullScreen',
          value: [],
        })
      }
    />
  );
};

export default FullScreen;
