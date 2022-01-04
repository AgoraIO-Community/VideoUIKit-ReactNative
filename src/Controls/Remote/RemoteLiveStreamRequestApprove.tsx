import React, {useContext} from 'react';
import {View} from 'react-native';
import BtnTemplate from '../BtnTemplate';
import PropsContext, {UidInterface} from '../../Contexts/PropsContext';

interface RemoteAudioMuteInterface {
  user: UidInterface;
}

const RemoteLiveStreamRequestApprove: React.FC<RemoteAudioMuteInterface> = (
  props,
) => {
  const {styleProps} = useContext(PropsContext);
  const {remoteBtnStyles} = styleProps || {};
  const {liveStreamHostControlBtns} = remoteBtnStyles || {};

  return (
    <View style={{...(liveStreamHostControlBtns as object), marginRight: 15}}>
      <BtnTemplate
        name={'checkCircleIcon'}
        style={{...(liveStreamHostControlBtns as object)}}
        onPress={() => {
          console.log('approved click');
        }}
      />
    </View>
  );
};

export default RemoteLiveStreamRequestApprove;
