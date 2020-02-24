<div style="text-align:center">
<h1> Agora React Native UIKit</h1>
<h6>Rapidly integrate video calling into your React Native applications with built in UI Elements.</h6>
</div>

## Getting started

### Installation

To a react-native application generated using react-native-cli, add the following:

**Peer dependencies:**
```
npm i react-native-vector-icons
npm i react-native-agora
react-native link react-native-vector-icons
```

**UIKit:**
```
npm i agora-rn-uikit
```

### Usage

This UIKit is very simple to use and contains a high level component called `AgoraUIKit`.

**A simple sample app integrating Agora UI Kit:**
```javascript
import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(true);
  const rtcProps = {
    appid: '<-----App ID here----->',
    channel: 'test',
  };
  const callbacks = {
    onEndCall: () => setVideoCall(false)
  }
  return (
    videoCall ?
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} /> :<></>
  );
};

export default App;
```