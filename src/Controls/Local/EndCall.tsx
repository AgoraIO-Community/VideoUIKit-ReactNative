import React, {useContext} from 'react';
import PropsContext from '../../Contexts/PropsContext';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import DispatchContext from '../../Contexts/DispatchContext';

interface EndCallProps {
  btnText?: string;
}

function EndCall(props?: EndCallProps) {
  const {styleProps} = useContext(PropsContext);
  const {localBtnStyles} = styleProps || {};
  const {endCall} = localBtnStyles || {};
  const {dispatch} = useContext(DispatchContext);

  return (
    <BtnTemplate
      //@ts-ignore
      name={'callEnd'}
      btnText={props?.btnText || 'Hang Up'}
      color="#FD0845"
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
