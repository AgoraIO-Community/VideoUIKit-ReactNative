import React, {useContext} from 'react';
import RtcContext from '../../Contexts/RtcContext';
import BtnTemplate from '../BtnTemplate';
import styles from '../../Style';
import PropsContext, {UidInterface} from '../../Contexts/PropsContext';

interface RemoteSwapInterface {
  user: UidInterface;
}

const RemoteSwap: React.FC<RemoteSwapInterface> = (props) => {
  const {dispatch} = useContext(RtcContext);
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {remoteSwap} = remoteBtnStyles || {};

  return (
    <BtnTemplate
      name={'remoteSwap'}
      style={
        props.user.uid !== 'local'
          ? {...styles.rightRemoteBtn, ...(remoteSwap as object)}
          : {}
      }
      onPress={() => {
        dispatch({
          type: 'SwapVideo',
          value: [props.user],
        });
      }}
    />
  );
};

export default RemoteSwap;
