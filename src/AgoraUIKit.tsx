/**
 * @module AgoraUIKit
 */
import React from 'react';
import {View} from 'react-native';
import RtcConfigure from './RtcConfigure';
import {
  PropsProvider,
  PropsInterface,
  layout as layoutEnum,
} from './Contexts/PropsContext';
import LocalControls from './Controls/LocalControls';
import GridVideo from './Views/GridVideo';
import PinnedVideo from './Views/PinnedVideo';
import LocalUserContext from './Contexts/LocalUserContext';

const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  const {layout} = props.rtcProps;
  return (
    <PropsProvider value={props}>
      <View
        style={[
          {backgroundColor: '#000', flex: 1},
          props.styleProps?.UIKitContainer,
        ]}>
        <RtcConfigure>
          <LocalUserContext>
            {layout === layoutEnum.grid ? <GridVideo /> : <PinnedVideo />}
            <LocalControls />
          </LocalUserContext>
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

export default AgoraUIKit;
