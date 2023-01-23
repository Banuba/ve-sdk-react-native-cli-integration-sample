# iOS Integration Guide into React Native CLI project

An integration and customization of Banuba Video Editor SDK is implemented in **ios** directory
of your React Native CLI project using native iOS development process.

## Basic
The following steps help to complete basic integration into your React Native CLI project.

:exclamation: The license token **IS REQUIRED** to run sample and an integration in your app.  
Please follow [Installation](../README.md#Installation) guide if the license token is not set<br></br>

<ins>All changes are made in **ios** directory.</ins>
1. __Add Banuba SDK dependencies__  
   Add iOS Video Editor SDK dependencies to your Podfile.</br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/ios/Podfile).</br><br>

2. __Setup React Native and iOS platform Bridge__  
   Add [BridgeHeader.h](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/ios/BridgeHeader.h) and [VideoEditorModuleBridge.m](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/ios/VideoEditorModuleBridge.m) files .</br>
   These files help to start Video Editor SDK from React Native.</br><br>

3. __Add SDK Initializer class__  
   Add [VideoEditorModule.swift](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/ios/VideoEditorModule.swift) file to your project.
   This class helps to initialize and customize Banuba Video Editor SDK.</br><br>

4. __Add assets and resources__
    1. [bundleEffects](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/ios/vesdkreactnativecliintegrationsample/bundleEffects) to use built-in Banuba AR effects. Using Banuba AR requires [Face AR product](https://docs.banuba.com/face-ar-sdk-v1). Please contact Banuba Sales managers to get more AR effects.
    2. [luts](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/ios/vesdkreactnativecliintegrationsample/luts) to use Lut effects shown in the Effects tab.</br><br>

5. __Start the SDK__  
   Use ```startIosVideoEditor()``` method defined in ```App.js``` to start Video Editor from React Native on iOS.</br>
   ```
       function initVideoEditor() {
         VideoEditorModule.initVideoEditor(LICENSE_TOKEN);
       }
   
       async function startIosVideoEditor() {
             initVideoEditor();
             return await VideoEditorModule.openVideoEditor();
       };
       
       <Button
                title = "Open Video Editor"
                onPress={async () => {
                    if (Platform.OS === 'ios') {
                        startIosVideoEditor().then(response => {
                          const exportedVideoUri = response?.videoUri;
                          console.log('Banuba iOS Video Editor export video completed successfully. Video uri = ' + exportedVideoUri)
                        }).catch(e => {
                          console.log('Banuba iOS Video Editor export video failed = ' + e)
                        })
                    } else {
                       ...
                    }
                  }
                }
            />
   ```
   Export returns response where you can find ```videoUri``` the path were exported video stored.</br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/App.js#L122)</br>


## What is next?

We have covered a basic process of Banuba Video Editor SDK integration into your React Native CLI project.</br>
More details and customization options you will find in [Banuba Video Editor SDK iOS Integration Sample](https://github.com/Banuba/ve-sdk-ios-integration-sample).