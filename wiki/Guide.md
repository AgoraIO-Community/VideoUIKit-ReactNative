# Create a React Native Video Chat App in 10 lines of Code using Agora UI Kit

When setting up your own streaming or conferencing application with Agora, a few
technical steps might slow you down. Now with Agora UIKit for React Native you
can create an application easily using just ten lines of code. You can customise
the the user experience and features to your requirements.

## Prerequisites

* An Agora developer account (see [How to Get Started with
Agora](https://www.agora.io/en/blog/how-to-get-started-with-agora))
* Node.js LTS Release
* iOS/Android device for testing
* A high level understanding of react native development

## Setup

You can get the code for the example on
[GitHub](https://github.com/AgoraIO-Community/agora-rtc-react/tree/master/example),
or you can create your own React-Native project. Open a terminal and execute:

    npx react-native init demo --template react-native-template-typescript
    cd demo

Install the Agora React Native SDK and UI Kit:


> At the time of writing this post the latest `agora-rn-uikit` release is
> `v3.1.0` and `react-native-agora` is `v3.3.3`.

If you’re using an iOS device you’ll need to run `cd ios && pod install` and
configure app signing by opening `ios/.xcworkspace` in Xcode. **The iOS simulator doesn't support camera, please use a physical devie for testing.**

That’s the setup, you can now run `npm run android` or build and run the project from Xcode to start
the server and see the barebones react-native app.

## Adding Video Streaming

This UIKit is simple to use and contains a high level component called
`AgoraUIKit`. It handles the logic and UI for our real-time video experience. We
can pass in props to the component to customise the behaviour and functionality.
Let’s clear the `App.tsx` file and start writing the code to build a video
chatting app.

    import React, {useState} from 'react';
    import AgoraUIKit from 'agora-rn-uikit';

    const App = () => {
    const [videoCall, setVideoCall] = useState(true);
    const rtcProps = {appId: '<-----App ID here----->', channel: 'test'};
    const callbacks = {EndCall: () => setVideoCall(false)};
    return videoCall ? <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> : null;
    };

    export default App;

We’re importing the `AgoraUIKit` component from the `agora-rn-uikit` package.
Inside the `App` component we have a state variable `videoCall`, we’ll render
the UI Kit component when it’s set to true and unmount it when it’s false. We
define the Agora App ID and channel name in the `rtcProps` object. The
`callbacks` object contains RTC events as keys and callback functions as their
value — we use the `EndCall` event to update the state and unmount the
`AgoraUIKit` component. In the return statement we render the `AgoraUIKit`
component with the `rtcProps` and `callbacks` object.

The UI Kit component also takes in a third prop called `styleProps` that can be
used to customise the look of the application by writing react-native styling.

## Default Functionality

By default, Agora UIKit includes the following functionality before any
customising:

* Automatically layout all video streams
* Displaying the active speaker in the larger display in the floating layout
* Allowing you to swap any stream to the larger display in the floating layout
* Buttons for disabling camera or microphone and switch cameras for the local
user.
* Buttons for muting the remote users’ audio and video locally in floating layout.
* Lots of visual customisation by only writing react native styling.
* Live streaming mode with your role as a broadcast or as audience.
* Two different layouts — floating and grid with an option build your own layout!

## Customising functionality with RtcProps

The `RtcProps` object lets you customize the how the UI Kit works. You can
select features and layouts. And there’s a growing list of things to customise
using `RtcProps`. The object type definition can be found here.

### Conferencing or Live-Streaming

You can use the UI Kit in two modes: in communication mode you can have a
maximum of 17 users on a call and everyone is able to communicate with each
other. 

In live-streaming mode you can select user roles: the broadcaster’s video and
audio is shared with everyone (max 17 broadcasters). The audience role (upto 1
million) let’s users receive video/audio but doesn’t let them send their
video/audio to other users.

Communication mode is the default. To use live-streaming mode you can set the
`mode: mode.LiveBroadcasting` in `rtcProps`. You can then select `role:
role.Audience` or `role:role.Broadcaster` (mode and role are enums exported by
the library).

### Floating or Grid Layout

You can select between two layouts out of the box, you have a pinned layout with
one user occupying the central screen with other users on a scrolling list at
the top (you can customise the position). Or a grid layout where each user takes
in a cell of a growing grid. The pinned layout supports active speaker
detection/manual swapping of users.

### Active Speaker Detection

You can enable this prop to switch the main view to the active speaker in the
application, you can also use the callback event `ActiveSpeaker` to pass in a
custom function to display a toast for example.

### Stream quality fallback *

You can enable dual-stream mode to fallback to low quality video if the user’s
internet bandwidth is low. You can select the fallback to either be to a low
quality stream or in extreme conditions to audio only. 

### Token Management

If you’re using the UI Kit in production we strongly recommend using tokens to
secure your app. To make it easy for you to manage tokens, there’s two ways. You
can supply a token manually to the UI Kit with the `token` property.

Or you can use the `tokenUrl` property. This property is an optional string that
can be used to automatically fetch a new access token for the channel if the
provided token has expired or is due to expire soon. The functionality for
requesting a new token expects the token to follow the URL scheme in the Golang
token server found on GitHub:
[AgoraIO-Community/agora-token-service](https://github.com/AgoraIO-Community/agora-token-service).

## Customising UI with StyleProps

The StyleProps object let’s you style different components that make up the
`AgoraUIKit` component. For example if you want square buttons instead of round
or if you want the controls to be at the top of the screen, you can pass in some
react-native styling to do that.

### The UI Kit View

You can set the styling for the UI Kit View by passing in react native styles to
the UIKitContainer property. For example if we want the Video Call to take up
half of the screen.

    <View style={{height:'50%'}}></View>

    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks}
    styleProps={{ UIKitContainer: {height: '50%', width: '100%'}}}
    />

Similarly you can customise the controls and it’s container, the main view, the
floating view, overlay and container, the grid container and cells. You can
change the borders, positioning, colors and so on. You can find a full list
here.

### Video Settings

videoMode prop lets you choose the AgoraVideoRenderMode for all the videos
rendered on your local device, with a choice between fill, fit, and hidden. See
Agora’s full documentation on AgoraVideoRenderMode
[here](https://docs.agora.io/en/Video/API%20Reference/oc/Constants/AgoraVideoRenderMode.html).

### Icon color, size and image

You can change the size and color of the icons using `iconSize` and `theme`
properties.
You can also use your own transparent PNG to replace the default icon using the `customIcon` prop and supplying the base64 encoded image. Example: Changing the end call icon - `customIcon: {callEnd: '<Base64String>'}`

### **Example**

// image

```jsx
import React, {useState} from 'react';
import AgoraUIKit, {
  VideoRenderMode,
  PropsInterface,
} from 'agora-rn-uikit';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const props: PropsInterface = {
    rtcProps: {
      appId: '<-----App ID here----->',
      channel: 'test',
    },
    styleProps: {
      iconSize: 30,
      theme: '#ffffffee',
      videoMode: {
        max: VideoRenderMode.Hidden,
        min: VideoRenderMode.Hidden,
      },
      overlayContainer: {
        backgroundColor: '#2edb8533',
        opacity: 1,
      },
      localBtnStyles: {
        muteLocalVideo: btnStyle,
        muteLocalAudio: btnStyle,
        switchCamera: btnStyle,
        endCall: {
          borderRadius: 0,
          width: 50,
          height: 50,
          backgroundColor: '#f66',
          borderWidth: 0,
        },
      },
      localBtnContainer: {
        backgroundColor: '#fff',
        bottom: 0,
        paddingVertical: 10,
        borderWidth: 4,
        borderColor: '#2edb85',
        height: 80,
      },
      maxViewRemoteBtnContainer: {
        top: 0,
        alignSelf: 'flex-end',
      },
      remoteBtnStyles: {
        muteRemoteAudio: remoteBtnStyle,
        muteRemoteVideo: remoteBtnStyle,
        remoteSwap: remoteBtnStyle,
        minCloseBtnStyles: remoteBtnStyle,
      },
      minViewContainer: {
        bottom: 80,
        top: undefined,
        backgroundColor: '#fff',
        borderColor: '#2edb85',
        borderWidth: 4,
        height: '26%',
      },
      minViewStyles: {
        height: '100%',
      },
      maxViewStyles: {
        height: '64%',
      },
      UIKitContainer: {height: '94%'},
    },
    callbacks: {
      EndCall: () => setVideoCall(false),
    },
  };

  return (
    <SafeAreaView>
      <Text style={textStyle}>Agora UI Kit Demo</Text>
      {videoCall ? (
        <>
          <AgoraUIKit
            styleProps={props.styleProps}
            rtcProps={props.rtcProps}
            callbacks={props.callbacks}
          />
        </>
      ) : (
        <TouchableOpacity
          style={startButton}
          onPress={() => setVideoCall(true)}>
          <Text style={{...textStyle, width: '50%'}}>Start Call</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const textStyle = {
  color: '#fff',
  backgroundColor: '#2edb85',
  fontWeight: '700',
  fontSize: 24,
  width: '100%',
  borderColor: '#2edb85',
  borderWidth: 4,
  textAlign: 'center',
  textAlignVertical: 'center',
};

const btnStyle = {
  borderRadius: 2,
  width: 40,
  height: 40,
  backgroundColor: '#2edb85',
  borderWidth: 0,
};

const startButton = {
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  height: '90%',
};

const remoteBtnStyle = {backgroundColor: '#2edb8555'};

export default App;
```

If you need finer control or want to build a custom layout for your application
that the `AgoraUIKit` component doesn’t support yet you can extract and use
individual components that make up the UI Kit and re-compose them together to
build your own custom solution without worrying about managing the SDK.

## Advanced Customisation: Recomposing the UI Kit

The UI Kit isn’t limited to using the `AgoraUIKit` component, it’s a high level
component made up of several other components that makes it easy to get started.
You can import and use the individual pieces to compose your app.

### RtcConfigure

The `RtcConfigure` comoponent contains all the logic for the video call. It
handles all the SDK events and maintains the users data. You can wrap the other
UI Kit components inside the `RtcConfigure` component to get access to user
objects. (Internally it wraps the `MaxUidProvider` and `MinUidProvider` around
the child components)

### LocalControls & RemoteControls

The UI Kit exports a `LocalControls` component that wraps `LocalAudioMute`,
`LocalVideoMute`, `SwitchCamera` and `EndCall` button components. It also shows
the remote mute for the max video view component with an optional `showButton`
prop. You can also use the individual button components in your app.

The library has a `RemoteControls` component that shows the `RemoteAudioMute`,
`RemoteVideoMute` and `RemoteSwap` (swaps the user with the maxUser) buttons .
It takes in the user object and an optional `showRemoteSwap` prop which disables
the `RemoteSwap` button.

> Note: *The remote controls only mute the remote user’s audio/video locally. The
> change isn’t reflected for anyone else on the call.*

### MaxVideoView & MinVideoView

To render the video of a user we have two components `MaxVideoView` and
`MinVideoView`, both require a user object as a prop. The difference is that
`MinVideoView` takes another optional prop `showOverlay` to display remote
controls as an overlay when the view is pressed.

### PropsContext

`PropsContext` uses the React [Context
API](https://reactjs.org/docs/context.html) giving you access to the provider
and consumer that lets other components access the props we pass to this
component. The library uses this to pass `rtcProps`, `styleProps` and
`callbacks` around.

### MaxUidContext & MinUidContext

The `MaxUidContext` gives you access to an array containing an object for the
user in the `MaxView` (main view in floating layout).

The `MinUidContext` give you access to an array of object for the users in the
`MinView` (top floating view in floating layout).

### A closer look at `AgoraUIKit component`

Let’s take a look at how the `AgoraUIKit` component is composed to understand
with an example.

    import React from 'react';
    import {View} from 'react-native';
    import RtcConfigure from './RTCConfigure';
    import {PropsProvider, PropsInterface, layout} from './PropsContext';
    import LocalControls from './Controls/LocalControls';
    import GridVideo from './GridVideo';
    import PinnedVideo from './PinnedVideo';

    const AgoraUIKit: React.FC<PropsInterface> = (props) => {

    return (
      <PropsProvider value={props}>
      <View style={props.styleProps?.UIKitContainer}>
      <RtcConfigure>
      {props.rtcProps?.layout === layout.grid ? (
        <GridVideo />
        ) : (
        <PinnedVideo />
        )}
      <LocalControls showButton={props.rtcProps.layout !== layout.grid} />
      </RtcConfigure>
      </View>
      </PropsProvider>
    );
    };

    export default AgoraUIKit;

We import all the required components from the library. The `AgoraUIKit`
component takes in props of type `PropsInterface` (`rtcProps`, `styleProps` and
`callbacks`) and passes them into the `PropsProvider` which wraps the component
tree.

We have a view applies the `UIKitContainer` styling. We wrap all the UI
components (video views, controls etc.) with the RtcConfigure component so that
we can access contexts. We have our layouts (GridVideo and PinnedVideo) and our
controls. 

Let’s take a look at how to use user contexts and render the videos:

    <MinUidConsumer>
      {(minUsers) =>
        minUsers.map((user) =>
          <MinVideoView user={user} key={user.uid} />
      )}
    </MinUidConsumer>

We’re using the `MinUidConsumer` to get access to our user object and rendering
a `MinVideoView` for each user. We pass in the user prop and use the uid as a
key. You can view the `pinnedVideo`
[component](https://github.com/AgoraIO-Community/ReactNative-UIKit/blob/master/src/PinnedVideo.tsx)
to get a full example.

## Summary

If there are features you think would be good to add to Agora UIKit for
React-Native that many users would benefit from, feel free to fork the
repository and add a pull request. Or open an issue on the repository with the
feature request. All contributions are appreciated!

The plan is to grow this library and have similar offerings across all supported
platforms. There are already similar libraries for
[iOS](https://github.com/AgoraIO-Community/iOS-UIKit/) and
[Android](https://github.com/AgoraIO-Community/Android-UIKit), so be sure to
check those out.
