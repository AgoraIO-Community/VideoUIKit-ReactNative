# Agora VideoUIKit for React Native
Instantly integrate Agora video calling or streaming into your React Native application.

![img](UI%20Kit.png)

## Getting started

### Requirements
- [An Agora developer account](https://www.agora.io/en/blog/how-to-get-started-with-agora?utm_source=github&utm_repo=ReactNative-UIKit) (it's free)
- Android or iOS Device
- React Native Project

[Expo](https://expo.dev/) is supported using custom-dev-clients, for more information read this [blog post](https://www.agora.io/en/blog/building-a-video-calling-app-using-the-agora-sdk-on-expo-react-native/)



### Installation
To a react-native application generated using react-native-cli, add the following:

```
npm i react-native-agora@3 agora-react-native-rtm agora-rn-uikit
```

We're working on supporting [react-native-agora](https://www.npmjs.com/package/react-native-agora) `v4.x` in the coming weeks.

### Usage

This VideoUIKit is very simple to use and contains a high level component called `AgoraUIKit`. You can check out code explanation here.

**A simple sample app integrating Agora UI Kit:**
```javascript
import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const connectionData = {
    appId: '<Agora App ID>',
    channel: 'test',
  };
  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
  ) : (
    <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
  );
};

export default App;
```

**Replace the `'<Agora App ID>'` with your own appID**.

If you created the Agora App in secured mode, you'll need to pass in an `rtcToken` and an `rtmToken` to the `connectionData` prop. Alternatively, you can deploy the one-click [token server](https://github.com/AgoraIO-Community/agora-token-service) and pass in the `tokenUrl`, the UIKit then automatically fetches and manages the tokens. 

### Demo Project
There's a React Native VideoUIKit demo [here](https://github.com/AgoraIO-Community/ReactNative-UIKit-example), and one with typescript [here](https://github.com/AgoraIO-Community/ReactNative-UIKit-example/tree/typescript).

### Instructions for running on Android:

1.  Connect your Android device to system with debugging on 
2.  Type `adb devices` to verify if the device is connected 
3.  Run `npm start` – This will start the development server 
4.  Open another terminal in the same folder 
5.  Run `npm run android` - This will deploy the app on the Android device. (Now, the app will connect our development server)
6.  Note Android simulators are not recommended since they might not be able to access the camera and microphone.

### Instructions for running on iOS:

1.  Connect an iOS device to your Mac, create an apple developer account and register your device with apple for development.
2.  Run `npx pod-install` to download the necessary pods.
3.  Open the `.xcworkspace` file located in `ios` folder using XCode.
4.  Open the info tab and add the following: 
    1.  **Privacy Camera description** - Camera permission
    2.  **Privacy Microphone description** - Mic permission
5.  Configure code signing: https://reactnative.dev/docs/running-on-device#2-configure-code-signing
6.  Run the project by clicking the Run button in Xcode 
7.  Note Simulators won’t work since iOS simulator can’t access the camera

## Documentation

For full documentation, see our [docs page](https://agoraio-community.github.io/VideoUIKit-ReactNative/).

You can visit the [wiki](https://github.com/AgoraIO-Community/VideoUIKit-ReactNative/wiki) for other examples and in depth guide.
