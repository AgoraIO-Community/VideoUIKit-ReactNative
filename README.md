<div style="text-align:center">
<h1> Agora React Native UIKit</h1>
<h6>Rapidly integrate video calling into your React Native applications with built in UI Elements.</h6>
</div>

## Getting started


**Important: Agora's react native SDK does NOT work with expo managed workflow. So this uikit WON'T work with expo apps either.**

### Installation

To a react-native application generated using react-native-cli, add the following:

```
npm i react-native-agora agora-rn-uikit
```

### Instructions for running on Android:

1.  Connect your Android device to system with debugging on 
2.  Type adb devices to verify if the device is connected 
3.  Navigate to the frontend directory `agora-app-builder/<projectName>/` in a terminal 
4.  Run `npm start` **–** This will start the development server 
5.  Open another terminal in the same folder 
6.  Run `npm run android` - This will deploy the app on the Android device. (Now, the app will connect our development server)


### Instructions for running on IOS:

1.  Connect an IOS device to system, create apple developer account and registed device for development 
2.  Run `npx pod-install`
3.  Open the `.xcworkspace` file located in `<projectName>/ios` folder using XCode.
4.  Open the info tab and add the following: 

    1.  Camera permission – **Privacy Camera description**
    2.  Mic permission – **Privacy Microphone description**
5.  Configure code signing: https://reactnative.dev/docs/running-on-device#2-configure-code-signing
6.  Run the project by clicking the Run button in Xcode 
7.  Note Simulators won’t work since IOS simulator can’t access camera

### Usage

This UIKit is very simple to use and contains a high level component called `AgoraUIKit`.

**A simple sample app integrating Agora UI Kit:**
```javascript
import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: '<-----App ID here----->',
    channel: 'test',
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
  ) : (
    <></>
  );
};

export default App;
```
