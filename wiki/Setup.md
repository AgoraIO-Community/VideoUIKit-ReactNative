# Setup

To set up a new react-native project with typescript execute:
```bash
> npx react-native init demo --template react-native-template-typescript
> cd demo
```

To install the Agora React Native SDK and UI Kit:

```bash
> npm i react-native-agora agora-rn-uikit
```

### Android
If you're using an android device, connect your device and enable debugging, you should be able to see your device when you run `adb devices`. You can use the android simulator as well. 

Start the metro server
```bash
> npm start
```
In a separate terminal execute
```bash
> npm run android
```
### iOS
**The iOS simulator doesn't support camera, please use a physical devie**

Install the cocoapods
```bash 
> cd ios && pod install
```
To test your app on an iOS device configure [code signing](https://reactnative.dev/docs/running-on-device) by opening `ios/.xcworkspace` in Xcode. Then build and launch your app from Xcode.