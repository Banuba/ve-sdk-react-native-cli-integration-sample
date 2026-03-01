# Banuba Video and Photo Editor SDK - React Native CLI integration sample

## Overview
[Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to quickly add short video functionality and possibly AR filters and effects into your mobile app.  
[AR Photo Editor SDK](https://www.banuba.com/photo-editor-sdk) allows you to quickly add the photo editing capabilities to your app.  
The sample demonstrates how to integrate Video and Photo Editor SDK to [React Native](https://reactnative.dev/) project.

## Usage
### License
Before you commit to a license, you are free to test all the features of the SDK for free.  
The trial period lasts 14 days. To start it, [send us a message](https://www.banuba.com/video-editor-sdk#form).  
We will get back to you with the trial token.

## Launch

Set Banuba license token [in the application](App.js#L13).

1. Ensure [Environment setup](https://reactnative.dev/docs/environment-setup) and [Running On Device](https://reactnative.dev/docs/running-on-device) guides are completed.
2. Install dependencies. Please check ```yarn --version``` and make sure you use the latest yarn version i.e.```4.1.1``` .
```bash
npm install
```
or
```bash
yarn install
```
and ensure your yarn version is at least ```4.1.1```
```bash
yarn --version
```

### Android
1. Ensure ```ANDROID_SDK_ROOT``` is set in your environment or configured in [sdk.dir](android/local.properties#1).
2. Launch from the Terminal or in your IDE.
```bash
npm run android
```
3. Integration guides:
    - [Video Editor](mddocs/quickstart_ve_android.md)
    - [Photo Editor](mddocs/quickstart_pe_android.md)

### iOS
1. Install CocoaPods dependencies
```bash
cd ios
pod install
```
2. Configure signing
    - Open ios/Runner.xcworkspace in Xcode
    - Select the Runner target
    - Choose your Development Team in Signing & Capabilities
3. Run the app
```bash
npm run ios
```
4. Integration guides
    - [Video Editor](mddocs/quickstart_ve_ios.md)
    - [Photo Editor](mddocs/quickstart_pe_ios.md)

## Documentation
Explore the full capabilities of our SDKs:
- [Video Editor SDK](https://docs.banuba.com/ve-pe-sdk/docs/android/requirements-ve)
- [Photo Editor SDK](https://docs.banuba.com/ve-pe-sdk/docs/android/requirements-pe)

## Support
For questions about Video Editor or Photo Editor SDK, reach out to Banuba support service
- [Video Editor SDK](https://www.banuba.com/faq/kb-tickets/new)
- [Photo Editor SDK](https://www.banuba.com/support)


## Dependencies
|              | Version | 
|--------------|:-------:|
| Yarn         |  4.1.1  |
| React Native | 0.79.1  |
| Android      |  8.0+   |
| iOS          |  15.0+  |
