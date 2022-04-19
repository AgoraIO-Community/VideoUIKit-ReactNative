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
import RtmConfigure from './RtmConfigure';
import LocalUserContext from './Contexts/LocalUserContext';
import PopUp from './Controls/Remote/RemoteMutePopUp';

const AgoraUIKit: React.FC<PropsInterface> = (props) => {
  const {layout} = props.rtcProps;
  return (
    <PropsProvider value={props}>
      <View style={[containerStyle, props.styleProps?.UIKitContainer]}>
        <RtcConfigure>
          <LocalUserContext>
            {props.rtcProps.disableRtm ? (
              <>
                {layout === layoutEnum.grid ? <GridVideo /> : <PinnedVideo />}
                <LocalControls />
              </>
            ) : (
              <RtmConfigure>
                {layout === layoutEnum.grid ? <GridVideo /> : <PinnedVideo />}
                <LocalControls />
                <PopUp />
              </RtmConfigure>
            )}
          </LocalUserContext>
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

const containerStyle = {backgroundColor: '#000', flex: 1};

export default AgoraUIKit;
