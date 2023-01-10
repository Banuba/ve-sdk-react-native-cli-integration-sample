# Banuba Video Editor SDK - React Native CLI integration sample.
[Banuba Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.
<br></br>

This sample demonstrates how to run Video Editor SDK with [React Native CLI](https://reactnative.dev/).  

<ins>The main part of integration and customization is implemented in **android**, **ios** directories using native Android and iOS development process.<ins>

## Dependencies
|              | Version | 
|--------------|:-------:|
| node         | 8.18.0  |
| react native | ~0.69.4 |
| Android      |  6.0+   |
| iOS          |  12.0+  |

## Usage

### Token
Before you commit to a license, you are free to test all the features of the SDK for free.  
The trial period lasts 14 days. To start it, [send us a message](https://www.banuba.com/video-editor-sdk#form).    
We will get back to you with the trial token.
You can store the token within the app.

Feel free to [contact us](https://www.banuba.com/faq/kb-tickets/new) if you have any questions.  
<br>
### Prepare project
1. Complete React Native [Environment setup](https://reactnative.dev/docs/environment-setup)
2. Complete [Running On Device](https://reactnative.dev/docs/running-on-device)
3. Run ```npm install``` in terminal to install dependencies
<br></br>

### Android
1. Make sure variable ```ANDROID_SDK_ROOT``` is set in your environment or configure [sdk.dir](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/local.properties#1).
2. Set Banuba token in the sample app [BanubaVideoEditor.Companion.initialize](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.java#L72).
3. Run ```npm run android``` in terminal to launch the sample app on a device or launch the app in IDE i.e. Intellij, VC, etc.
4. Follow [Android Integration Guide](mddocs/android_integration.md) to integrate Video Editor SDK into your React Native CLI project.

### iOS
:exclamation: **Important:** Please before run ```sudo arch -x86_64 gem install ffi``` in terminal for Apple M-series chip based on ARM architecture.

1. Install CocoaPods dependencies. Open **ios** directory and run in terminal ```pod install``` or ```arch -x86_64 pod install``` for Apple M1.
2. Open **Signing & Capabilities** tab in Target settings and select your Development Team.
3. Set Banuba token in the sample app [VideoEditor initializer](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/ios/VideoEditorModule.swift#L150).
4. Run ```npm run ios``` in terminal to launch the sample on a device or launch the app in IDE i.e. XCode, Intellij, VC, etc.
5. Follow [iOS Integration Guide](mddocs/ios_integration.md) to integrate the Video Editor SDK into your React Native CLI project.

