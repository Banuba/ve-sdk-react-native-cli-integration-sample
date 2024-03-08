# Banuba Video and Photo Editor SDK - React Native CLI integration sample

## Overview
[Banuba Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.  
[Banuba AR Photo Editor SDK](https://www.banuba.com/photo-editor-sdk) allows you to quickly add the photo editing capabilities to your app.  
The sample demonstrates how to integrate Video and Photo Editor SDK to [React Native CLI](https://reactnative.dev/) project.

## Usage
### License
Before you commit to a license, you are free to test all the features of the SDK for free.  
The trial period lasts 14 days. To start it, [send us a message](https://www.banuba.com/video-editor-sdk#form).  
We will get back to you with the trial token.

Feel free to [contact us](https://www.banuba.com/faq/kb-tickets/new) if you have any questions.

## Installation
1. Complete React Native [Environment setup](https://reactnative.dev/docs/environment-setup)
2. Complete [Running On Device](https://reactnative.dev/docs/running-on-device)
3. Run ```npm install``` or ```yarn install``` in terminal to install dependencies.

## Launch

Set Banuba license token [within the app](App.js#L13).

### Android
1. Make sure variable ```ANDROID_SDK_ROOT``` is set in your environment or configure [sdk.dir](android/local.properties#1).
2. Run ```npm run android``` in terminal to launch the sample app on a device or launch the app in IDE i.e. Intellij, VC, etc.
3. Follow [Video Editor](mddocs/quickstart_ve_android.md) and [Photo Editor](mddocs/quickstart_pe_android.md) quickstart guides to quickly integrate Video and Photo Editor SDK into your React Native project on Android.

### iOS
1. Install CocoaPods dependencies. Open ```ios``` directory and run in terminal ```pod install```.
2. Open **Signing & Capabilities** tab in Target settings and select your Development Team.
3. Run ```npm run ios``` in terminal to launch the sample on a device or launch the app in IDE i.e. XCode, Intellij, VC, etc.
4. Follow [Video Editor](mddocs/quickstart_ve_ios.md) and [Photo Editor](mddocs/quickstart_pe_ios.md) quickstart guides to quickly integrate Video and Photo Editor SDK into your React Native project on iOS.

## Dependencies
|              | Version | 
|--------------|:-------:|
| react native | 0.72.11 |
| Android      |  6.0+   |
| iOS          |  13.0+  |
