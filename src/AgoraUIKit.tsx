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
import RtmConfigure from './RtmConfigure';
import LocalUserContext from './Contexts/LocalUserContext';

const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  const {layout} = props.rtcProps;
  return (
    <PropsProvider value={props}>
      <View style={props.styleProps?.UIKitContainer}>
        <RtcConfigure>
          <LocalUserContext>
            <RtmConfigure>
              {layout === layoutEnum.grid ? <GridVideo /> : <PinnedVideo />}
              <LocalControls />
            </RtmConfigure>
          </LocalUserContext>
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

export default AgoraUIKit;
