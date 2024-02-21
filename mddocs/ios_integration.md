# iOS Video and Photo Editor SDK quick start

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Add dependencies](#add-dependencies)
- [Add bridge between React Native and iOS](#add-bridge-between-react-native-and-ios)
- [Add SDK integration module](#add-sdk-integration-module)
- [Add resources](#add-resources)
- [Start Video Editor SDK](#start-video-editor-sdk)
- [Enable custom Audio Browser experience](#enable-custom-audio-browser-experience)
- [Start Photo Editor SDK](#start-photo-editor-sdk)
- [What is next?](#what-is-next)
## Overview
The following guide covers basic integration process into your React Native project
where required part of an integration and customization of Banuba Video and Photo Editor SDK is implemented in **ios** directory of your project using native iOS development process.
## Prerequisites
> [!CAUTION]
> The license token is required to run sample and an integration into your app. Please follow [Installation](../README.md#Installation) guide if the license token is not set.  
## Add dependencies
Add iOS Video and Photo Editor SDK dependencies to your [Podfile](../ios/Podfile).
## Add bridge between React Native and iOS
Add [BridgeHeader.h](../ios/BridgeHeader.h) and [SdkEditorModuleBridge.m](../ios/SdkEditorModuleBridge.m) files for communication between React Native and iOS.
## Add SDK integration module
Add [SdkEditorModule.swift](../ios/SdkEditorModule.swift) file to initialize the SDK dependencies. This class also allows you to customize many Video and Photo Editor SDK features i.e. min/max video durations, export flow, order of effects and others.
## Add resources
**Video Editor SDK** uses a lot of resources required for running.  
Please make sure all these resources are provided in your project.
1. [bundleEffects](../ios/vesdkreactnativecliintegrationsample/bundleEffects) to use built-in Banuba AR effects. Using Banuba AR requires [Face AR product](https://docs.banuba.com/face-ar-sdk-v1). Please contact Banuba Sales managers to get more AR effects.
2. [luts](../ios/vesdkreactnativecliintegrationsample/luts) to use Lut effects shown in the Effects tab.
3. [Localizable.strings](../ios/Localizable.strings) file with English localization. 

**Photo Editor SDK** needs only the [Localizable.strings](../ios/Localizable.strings) file.
## Start Video Editor SDK
First, initialize the Video Editor SDK using license token in ```SdkEditorModule``` on iOS.
```swift
let videoEditor = BanubaVideoEditor(
        token: token,
        ...
      )
```
Please note that the instance  ```videoEditor``` can be **nil** if the license token is incorrect.  
[See example](../ios/SdkEditorModule.swift#L46)

Next, to start Video Editor SDK from React Native use ```startIosVideoEditor()``` method defined in [App.js](../App.js#L25).
It will open Video Editor SDK from camera screen.
```javascript
function initSDK() {
  SdkEditorModule.initVideoEditor(LICENSE_TOKEN);
}

async function startIosVideoEditor() {
  initSDK();
  return await SdkEditorModule.openVideoEditor();
}
       
<Button
  title = "Open Video Editor"
  onPress={async () => {
		if (Platform.OS === 'ios') {
			startIosVideoEditor().then(response => {
			  const exportedVideoUri = response?.videoUri;
			  // Handle received exported video
			}).catch(e => {
			  // Handle error
			})
		} 
     }
  }
/>
 ```
Export returns [videoUri](../App.js#L159) path as a ```String``` value where exported video stored to ReactNative.
## Enable custom Audio Browser experience
Video Editor SDK allows to implement your experience of providing audio tracks for your users - custom Audio Browser.  
To check out the simplest experience you can set ```true``` to [configEnableCustomAudioBrowser](../ios/AppDelegate.swift#L15)  
> [!IMPORTANT]
> Video Editor SDK can play only files stored on device.
## Start Photo Editor SDK
First, initialize the Photo Editor SDK using the license token in ```SdkEditorModule``` on iOS.
```swift
let photoEditorSDK = BanubaPhotoEditor(
          token: token,
          ...
      )
```
Please note that the instance ```photoEditorSDK``` can be **nil** if the license token is incorrect.

Next, to start the Photo Editor SDK from React Native use ```startIosPhotoEditor()``` method defined in [App.js](../App.js#L40).
It will open the Photo Editor SDK from gallery screen.
```javascript
async function startIosPhotoEditor() {
  await SdkEditorModule.initPhotoEditor(LICENSE_TOKEN);
  return await SdkEditorModule.openPhotoEditor();
}
       
<Button
  title = "Open Photo Editor"
  onPress={async () => {
		if (Platform.OS === 'ios') {
			startIosPhotoEditor().then(response => {
			  const exportedPhotoUri = response?.photoUri;
			  // Handle received exported photo
			}).catch(e => {
			  // Handle error
			})
		} 
     }
  }
/>
 ```
Export returns the [photoUri](../App.js#L131) path as a ```String``` value of local URL that leads to exported photo in png format.
## What is next?
We have covered a basic process of Banuba Video and Photo Editor SDK integration into your React Native CLI project.

More details and customization options can be found in [Banuba Video and Photo Editor SDK iOS Integration Sample](https://github.com/Banuba/ve-sdk-ios-integration-sample).