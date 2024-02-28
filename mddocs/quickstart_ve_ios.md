# iOS Video and Photo Editor SDK quick start

This guide demonstrates how to quickly integrate iOS Video Editor SDK into React Native project.
The main part of an integration and customization is implemented in ```ios``` directory
of React Native project using native iOS development process.

Once complete you will be able to launch video editor in your React Native project.

- [Installation](#installation)
- [Resources](#resources)
- [Configuration](#configuration)
- [Launch](#launch)
- [Connect External Audio API](#connect-external-audio-api)
- [What is next?](#what-is-next)


## Installation
Add iOS Video Editor SDK dependencies to your [Podfile](../ios/Podfile).

## Resources
**Video Editor SDK** uses a lot of resources required for running.  
Please make sure all these resources are provided in your project.
1. [bundleEffects](../ios/vesdkreactnativecliintegrationsample/bundleEffects) to use built-in Banuba AR effects. Using Banuba AR requires [Face AR product](https://docs.banuba.com/face-ar-sdk-v1). Please contact Banuba Sales managers to get more AR effects.
2. [luts](../ios/vesdkreactnativecliintegrationsample/luts) to use Lut effects shown in the Effects tab.
3. [Localizable.strings](../ios/Localizable.strings) file with English localization.

**Photo Editor SDK** needs only the [Localizable.strings](../ios/Localizable.strings) file.

## Configuration
Add [BridgeHeader.h](../ios/BridgeHeader.h) and [SdkEditorModuleBridge.m](../ios/SdkEditorModuleBridge.m) files for communication between React Native and iOS 
and [SdkEditorModule.swift](../ios/SdkEditorModule.swift) file to initialize the SDK dependencies. This class also allows you to customize many Video and Photo Editor SDK features i.e.
min/max video durations, export flow, order of effects and others.

## Launch

Invoke [initSDK](../App.js#L15) on React Native side to initialize Video Editor SDK with the license token.
```javascript
SdkEditorModule.initSDK(LICENSE_TOKEN);
```

Add [ReactMethod](../ios/SdkEditorModule.swift#L35) on iOS side to initialize Video Editor SDK.

Please note that the instance  ```videoEditor``` can be **nil** if the license token is incorrect.  
[See example](../ios/SdkEditorModule.swift#L40)

Finally, once the SDK in initialized you can invoke [openVideoEditor](../App.js#L19) message from React Native to iOS

```javascript
await SdkEditorModule.openVideoEditor();
```

and add [ReactMethod](../ios/SdkEditorModule.swift#L56) on iOS side to start Video Editor.


Export returns [videoUri](../App.js#L159) path as a ```String``` value where exported video stored to ReactNative.

## Connect External Audio API
Video Editor SDK allows to implement your experience of providing audio tracks for your users - custom Audio Browser.  
To check out the simplest experience you can set ```true``` to [configEnableCustomAudioBrowser](../ios/AppDelegate.swift#L15)  
> [!IMPORTANT]
> Video Editor SDK can play only files stored on device.

## What is next?
We have covered a basic process of Banuba Video Editor SDK integration into your React Native project.

Please check out [docs](https://docs.banuba.com/ve-pe-sdk/docs/ios/requirements) to know more about the SDK and complete full integration.