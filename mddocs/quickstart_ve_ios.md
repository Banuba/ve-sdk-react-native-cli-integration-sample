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


## Installation
Add iOS Video Editor SDK dependencies to your [Podfile](../ios/Podfile).

## Resources
**Video Editor SDK** uses a lot of resources required for running.  
Please make sure all these resources are provided in your project.
1. [bundleEffects](../ios/vesdkreactnativecliintegrationsample/bundleEffects) to use built-in Banuba AR effects. Using Banuba AR requires [Face AR product](https://docs.banuba.com/face-ar-sdk-v1). Please contact Banuba Sales managers to get more AR effects.
2. [luts](../ios/vesdkreactnativecliintegrationsample/luts) to use Lut effects shown in the Effects tab.
3. [Localizable.strings](../ios/Localizable.strings) file with English localization.

**Video Editor SDK** needs only the [Localizable.strings](../ios/Localizable.strings) file.

## Configuration

> [!IMPORTANT]  
> Check if the file YourProject-Bridging-Header.h is exist in your react native project by the path YourProject/ios.

<details>
<summary>I don't have YourProject-Bridging-Header.h in my React Native project</summary>
<br>
If you don't have the YourProject-Bridging-Header.h file then open your IOS project in the XCode. 
Next create a new Swift file in your project by the path File -> New -> File:

![Adding a new Swift file s_1](/assets/images/screenshot_1.png)
![Adding a new Swift file s_2](/assets/images/screenshot_2.png)
![Adding a new Swift file s_3](/assets/images/screenshot_3.png)

Xcode suggest you to add a Bridging Header. Accept it:

![Adding a new Swift file s_4](/assets/images/screenshot_4.png)
</details>

Open your IOS project in Xcode. Copy and paste the code from [BridgeHeader.h](../ios/BridgeHeader.h) to your Bridging-Header.h file
and create the [SdkEditorModuleBridge.m](../ios/SdkEditorModuleBridge.m) file for communication between React Native and iOS. 
Next create the [SdkEditorModule.swift](../ios/SdkEditorModule.swift) file to initialize the SDK dependencies. This class also allows you to customize many Video and Photo Editor SDK features i.e.
min/max video durations, export flow, order of effects and others.
<details>
<summary>IHow to create a file in Xcode?</summary>
<br>
To create a files go to File -> New -> File in Xcode:

![Adding a new Swift file s_1.1](/assets/images/screenshot_1.png)
![Adding a new Swift file s_5](/assets/images/screenshot_5.png)
</details>

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

### Export media
Video Editor SDK exports single video with auto quality by default. Auto quality is based on device hardware capabilities.

Process the result and pass it to [handler](../App.js#L53) on React Native side.

## Connect External Audio API
Video Editor SDK allows to implement your experience of providing audio tracks for your users - custom Audio Browser.  
To check out the simplest experience you can set ```true``` to [configEnableCustomAudioBrowser](../ios/AppDelegate.swift#L15)  
> [!IMPORTANT]
> Video Editor SDK can play only files stored on device.
