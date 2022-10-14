# Banuba Video Editor SDK - React Native CLI integration sample.
[Banuba Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.
<br></br>

:exclamation: <ins>Support for React Native plugin is under development at the moment and scheduled for __end Q4__. Please, reach out to [support team](https://www.banuba.com/faq/kb-tickets/new) to help you with your React Native CLI integration.<ins>

<ins>Keep in mind that main part of integration and customization should be implemented in **android**, **ios** directories using native Android and iOS development process.<ins>

This sample demonstrates how to run Video Editor SDK with [React Native CLI](https://reactnative.dev/).

## Dependencies
|              | Version | 
|--------------|:-------:|
| node         | 8.18.0  |
| react native | ~0.69.4 |
| Android      |  6.0+   |
| iOS          |  12.0+  |

## Integration

### Token
We offer а free 14-days trial for you could thoroughly test and assess Video Editor SDK functionality in your app.

To get access to your trial, please, get in touch with us by [filling a form](https://www.banuba.com/video-editor-sdk) on our website. Our sales managers will send you the trial token.

:exclamation: The token **IS REQUIRED** to run sample and an integration in your app.</br>
<br>
### Prepare project
1. Complete React Native [Environment setup](https://reactnative.dev/docs/environment-setup)
2. Complete [Running On Device](https://reactnative.dev/docs/running-on-device)
3. Run ```npm install``` in terminal to install dependencies
<br></br>

### Android
1. Make sure variable ```ANDROID_SDK_ROOT``` is set in your environment or configure [sdk.dir](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/local.properties#1).
2. Set Banuba token in the sample app [resources](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/res/values/strings.xml#L5).
3. Run ```npm run android``` in terminal to launch the sample app on a device or launch the app in IDE i.e. Intellij, VC, etc.
4. Follow [Android Integration Guide](mddocs/android_integration.md) to integrate Video Editor SDK into your React Native CLI project.

### iOS
:exclamation: **Important:** Please before run ```sudo arch -x86_64 gem install ffi``` in terminal for Apple M-series chip based on ARM architecture.

1. Install CocoaPods dependencies. Open **ios** directory and run in terminal ```pod install``` or ```arch -x86_64 pod install``` for Apple M1.
2. Open **Signing & Capabilities** tab in Target settings and select your Development Team.
3. Set Banuba token in the sample app [VideoEditor initializer](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/ios/VideoEditorModule.swift#L29).
4. Run ```npm run ios``` in terminal to launch the sample on a device or launch the app in IDE i.e. XCode, Intellij, VC, etc.
5. Follow [iOS Integration Guide](mddocs/ios_integration.md) to integrate the Video Editor SDK into your React Native CLI project.

