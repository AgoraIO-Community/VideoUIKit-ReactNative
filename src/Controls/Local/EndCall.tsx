import React, {useContext} from 'react';
import PropsContext from '../../PropsContext';
import RtcContext, {DispatchType} from '../../RtcContext';
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
      style={{...styles.endCall, ...(endCall as object)}}
      onPress={() =>
        (dispatch as DispatchType<'EndCall'>)({
          type: 'EndCall',
          value: [],
        })
      }
    />
  );
}

export default EndCall;
