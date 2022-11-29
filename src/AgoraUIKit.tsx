/**
 * @module AgoraUIKit
 */
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import LocalUserContext from './Contexts/LocalUserContext';
import {
  AgoraUIKitProps, Layout, PropsInterface, PropsProvider
} from './Contexts/PropsContext';
import LocalControls from './Controls/LocalControls';
import PopUp from './Controls/Remote/RemoteMutePopUp';
import RtcConfigure from './RtcConfigure';
import RtmConfigure from './RtmConfigure';
import GridVideo from './Views/GridVideo';
import PinnedVideo from './Views/PinnedVideo';

/**
 * Agora UIKit component following the v3 props
 * @returns Renders the UIKit
 */
const AgoraUIKitv3: React.FC<PropsInterface> = (props) => {
  const {layout} = props.rtcProps;
  const [fullScreen, setFullScreen] = useState(false);
  console.log('screen', fullScreen);
  return (
    <PropsProvider value={props}>
      <View style={[containerStyle, props.styleProps?.UIKitContainer, fullScreen ? fullScreenStyle : {}]}>
        <RtcConfigure>
          <LocalUserContext>
            {props.rtcProps.disableRtm ? (
              <>
                {layout === Layout.Grid ? <GridVideo /> : <PinnedVideo />}
                <LocalControls fullScreenAction={() => setFullScreen(!fullScreen)} />
              </>
            ) : (
              <RtmConfigure>
                {layout === Layout.Grid ? <GridVideo /> : <PinnedVideo />}
                <LocalControls fullScreenAction={() => setFullScreen(!fullScreen)} />
                <PopUp />
              </RtmConfigure>
            )}
          </LocalUserContext>
        </RtcConfigure>
      </View>
    </PropsProvider>
  );
};

/**
 * Agora UIKit component
 * @returns Renders the UIKit
 */
const AgoraUIKit: React.FC<AgoraUIKitProps> = (props) => {
  const {rtcUid, rtcToken, rtmToken, rtmUid, ...restConnectonData} =
    props.connectionData;
  const adaptedProps: PropsInterface = {
    rtcProps: {
      uid: rtcUid,
      token: rtcToken,
      ...restConnectonData,
      ...props.settings,
    },
    rtmProps: {
      token: rtmToken,
      uid: rtmUid,
      ...restConnectonData,
      ...props.settings,
    },
  };

  return (
    <AgoraUIKitv3
      rtcProps={adaptedProps.rtcProps}
      rtmProps={adaptedProps.rtmProps}
      callbacks={props.rtcCallbacks}
      rtmCallbacks={props.rtmCallbacks}
      styleProps={props.styleProps}
    />
  );
};

const containerStyle = {backgroundColor: '#000', flex: 1};
const fullScreenStyle = {height: Dimensions.get('screen').height - 120};
console.log('style', fullScreenStyle)

export default AgoraUIKit;
