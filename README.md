# Banuba AI Video Editor SDK - React Native CLI integration sample.
Banuba [AI Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.
<br></br>

:exclamation: <ins>Support for React Native plugin is under development at the moment and scheduled for __end Q4__. Please, reach out to [support team](https://www.banuba.com/faq/kb-tickets/new) to help you with your own React Native integration.<ins>

<ins>Keep in mind that main part of integration and customization should be implemented in **android**, **ios** directories using Native Android and iOS development.<ins>

This sample demonstrates how to run VE SDK with [React Native CLI](https://reactnative.dev/).

## Dependencies
|              | Version | 
|--------------|:-------:|
| npm          | 8.18.0  |
| react native | ~0.69.4 |

## Integration

### Token
We offer а free 14-days trial for you could thoroughly test and assess Video Editor SDK functionality in your app.

To get access to your trial, please, get in touch with us by [filling a form](https://www.banuba.com/video-editor-sdk) on our website. Our sales managers will send you the trial token.

:exclamation: The token **IS REQUIRED** to run sample and an integration in your app.</br>
<br>
### Prepare project
1. Complete React Native [Environment setup](https://reactnative.dev/docs/environment-setup)
2. Complete [Running On Device](https://reactnative.dev/docs/running-on-device)
3. Run command ```npm install``` in terminal to install dependencies
<br></br>

### Android
1. Make sure variable ```ANDROID_SDK_ROOT``` is set in your environment or configure [sdk.dir](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/local.properties#1).
2. Set Banuba token in the sample app [resources](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/app/src/main/res/values/strings.xml#5).
3. Run ```npm run android``` in terminal to launch the sample app on a device or launch the app in IDE i.e. Intellij, VC, etc.
4. Follow [Android Integration Guide](mddocs/android_integration.md) to integrate the SDK into your React Native CLI project.

### iOS
:exclamation: **Important:** Please run the following steps for Apple M-series chip based on ARM architecture :
`sudo arch -x86_64 gem install ffi`

1. Install Cocoa Pods dependencies in **ios** directory using ```pod install``` and ```arch -x86_64 pod install``` for Apple M1.
2. Set Banuba token in [VideoEditorModule initializer](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/ios/VideoEditorModule.swift#L34).
3. Run ```npm run ios``` in terminal to launch the sample on device or launch the app in IDE i.e. XCode, Intellij, VC, etc..
4. [Follow further instructions](https://github.com/Banuba/ve-sdk-ios-integration-sample) to integrate VE SDK in your app using native iOS development.

