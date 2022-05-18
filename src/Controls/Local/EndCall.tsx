import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';

function EndCall() {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {endCall} = localBtnStyles || {};
  const {dispatch} = useContext(RtcContext);

  return (
    <BtnTemplate
      name={'callEnd'}
      btnText={'Hang Up'}
      color="#FFF"
      style={{...styles.endCall, ...(endCall as object)}}
      onPress={() =>
        dispatch({
          type: 'EndCall',
          value: [],
        })
      }
    />
  );
}

export default EndCall;
