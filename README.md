# Banuba AI Video Editor SDK. Integration sample for React Native created using react-native CLI.
Banuba [Video Editor SDK](https://www.banuba.com/video-editor-sdk) allows you to add a fully-functional video editor with Tiktok-like features, AR filters and effects in your app.   
The following sample briefly demonstrates how you can integrate our SDK into your [React Native](https://reactnative.dev/) project.

## Please use react-native official docs to set up your local environment and run on device
1. [Setting up the development environment](https://reactnative.dev/docs/environment-setup)
2. [Running On Device](https://reactnative.dev/docs/running-on-device)

# Android
1. Make sure variable **ANDROID_SDK_ROOT** is in your environment or you can configure [sdk.dir](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/local.properties#1).
2. Put [Banuba Face AR token](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/app/src/main/res/values/strings.xml#5) in resources.
3. Run command `npm install` to install dependencies
4. Run command `npm run android` to launch the sample on device or `cd android && ./gradlew clean && cd .. && npm run android` to clean and re-run the sample.

## How to get exported video file

Video Editor SDK is launched within VideoCreationActivity. Therefore, exported video is returned from this activity into onActivityResult callback in [VideoEditorModule](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/app/src/main/java/com/vesdkreactnativeintegrationsample/VideoEditorModule.kt).

To connect android platform code with JS we use [Promises approach](https://reactnative.dev/docs/native-modules-android#promises). In this sample we send an exported video uri as a string from our VideoEditorModule into JS code (checkout [App.js](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/App.js#L39) file for details).

You can configure all data passed from VideoEditorModule depends on your requirements.

To set exported video name just place the desired one into `fileName()` builder method inside [IntegrationAppExportParamsProvider](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/android/app/src/main/java/com/vesdkreactnativeintegrationsample/videoeditor/export/IntegrationAppExportParamsProvider.kt#L39) class.

# iOS
:exclamation: **Important:** Please run the following steps for Apple M-series chip based on ARM architecture :
`sudo arch -x86_64 gem install ffi`

1. Install Node and Cocoapods dependencies using `npm ci && cd ios && pod install` and `npm ci && cd ios && arch -x86_64 pod install` for Apple M1.
2. Put [Banuba Face AR token](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/main/ios/VideoEditorModule.swift#L34).
3. Run command `npx react-native run-ios` to launch the sample on device.

