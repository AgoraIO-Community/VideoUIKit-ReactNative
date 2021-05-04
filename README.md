# Agora UI Kit for React Native
Instantly integrate Agora video calling or streaming into your React Native application.

![img](UI%20Kit.png)

## Getting started

### Requirements
- [An Agora developer account](https://www.agora.io/en/blog/how-to-get-started-with-agora?utm_source=github&utm_repo=agora-ios-uikit)
- Android or iOS Device
- React Native Project

Expo manged workflow isn't supported as the library uses native modules. Either use react-native-cli or use the 'expo eject' command to convert your app from an expo-managed workflow to a bare workflow. Once you have an Agora developer account and an App ID, you're ready to use this library.


### Installation
To a react-native application generated using react-native-cli, add the following:

```
npm i react-native-agora agora-rn-uikit
```

### Usage

This UIKit is very simple to use and contains a high level component called `AgoraUIKit`. You can check out code explanation here.

**A simple sample app integrating Agora UI Kit:**
```javascript
import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appId: '<Agora App ID>',
    channel: 'test',
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
  ) : (
    <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
  );
};

export default App;
```

**Replace the `'<Agora App ID>'` with your own appID**. 

### Instructions for running on Android:

1.  Connect your Android device to system with debugging on 
2.  Type adb devices to verify if the device is connected 
3.  Run `npm start` – This will start the development server 
4.  Open another terminal in the same folder 
5.  Run `npm run android` - This will deploy the app on the Android device. (Now, the app will connect our development server)
6.  Note Android simulators are not recommended since they might not be able to access camera and mic.

### Instructions for running on iOS:

1.  Connect an IOS device to system, create an apple developer account and register your device with apple for development.
2.  Run `npx pod-install` to download the necessary pods.
3.  Open the `.xcworkspace` file located in `ios` folder using XCode.
4.  Open the info tab and add the following: 
    1.  **Privacy Camera description** - Camera permission
    2.  **Privacy Microphone description** - Mic permission
5.  Configure code signing: https://reactnative.dev/docs/running-on-device#2-configure-code-signing
6.  Run the project by clicking the Run button in Xcode 
7.  Note Simulators won’t work since IOS simulator can’t access camera

## Documentation

For full documentation, see our [docs page](https://agoraio-community.github.io/ReactNative-UIKit/).

You can visit the [wiki](https://github.com/AgoraIO-Community/ReactNative-UIKit/wiki) for other examples and in depth guide.