import React, {useContext} from 'react';
import RtcContext, {UidType} from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext from '../../Contexts/PropsContext';
import useLocalUid from '../../Utils/useLocalUid';

interface RemoteSwapInterface {
  uid: UidType;
}

const RemoteSwap: React.FC<RemoteSwapInterface> = (props) => {
  const {dispatch} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {remoteSwap} = remoteBtnStyles || {};
  const localUid = useLocalUid();
  return (
    <BtnTemplate
      name={'remoteSwap'}
      style={
        props.uid !== localUid
          ? {...styles.rightRemoteBtn, ...(remoteSwap as object)}
          : {}
      }
      onPress={() => {
        dispatch({
          type: 'SwapVideo',
          value: [props.uid],
        });
      }}
    />
  );
};

export default RemoteSwap;
