# Banuba Video Editor SDK - React Native CLI integration sample.

## Overview
[Banuba Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.
<br>  
The sample demonstrates how to run Video Editor SDK with [React Native](https://reactnative.dev/) and [React Native CLI](https://reactnative.dev/).

## Usage
### License
Before you commit to a license, you are free to test all the features of the SDK for free.  
The trial period lasts 14 days. To start it, [send us a message](https://www.banuba.com/video-editor-sdk#form).  
We will get back to you with the trial token.

Feel free to [contact us](https://www.banuba.com/faq/kb-tickets/new) if you have any questions.

### Installation
1. Complete React Native [Environment setup](https://reactnative.dev/docs/environment-setup)
2. Complete [Running On Device](https://reactnative.dev/docs/running-on-device)
3. Run ```npm install``` or ```yarn install``` in terminal to install dependencies.
4. Set Banuba license token [within the app](App.js#L12).

### Run on Android
1. Make sure variable ```ANDROID_SDK_ROOT``` is set in your environment or configure [sdk.dir](android/local.properties#1).
2. Run ```npm run android``` in terminal to launch the sample app on a device or launch the app in IDE i.e. Intellij, VC, etc.
3. Learn [Android quickstart](mddocs/android_integration.md) to quickly integrate Android Video Editor SDK into your React Native CLI project.

### Run on iOS
:exclamation: **Important:** Please run ```sudo arch -x86_64 gem install ffi``` in terminal for Apple M-series chip based on ARM architecture.

1. Install CocoaPods dependencies. Open **ios** directory and run in terminal ```pod install``` or ```arch -x86_64 pod install``` for Apple M1.
2. Open **Signing & Capabilities** tab in Target settings and select your Development Team.
3. Run ```npm run ios``` in terminal to launch the sample on a device or launch the app in IDE i.e. XCode, Intellij, VC, etc.
4. Learn [iOS quickstart](mddocs/ios_integration.md) to quickly integrate iOS Video Editor SDK into your React Native CLI project.

## Dependencies
|              | Version | 
|--------------|:-------:|
| node         | 8.18.0  |
| react native | ~0.69.4 |
| Android      |  6.0+   |
| iOS          |  12.0+  |
