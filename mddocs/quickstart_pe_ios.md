# iOS Photo Editor SDK quickstart

This guide demonstrates how to quickly integrate iOS Photo Editor SDK into your React Native project.
The main part of an integration and customization is implemented in ```ios``` directory
in your React Native project using native iOS development process.

Once complete you will be able to launch photo editor in your React Native project.

## Installation

Add iOS Photo Editor SDK dependency ```pod 'BanubaPhotoEditorSDK', '1.2.8'``` to your [Podfile](../ios/Podfile).

## Launch
First, initialize the Photo Editor SDK using the license token in ```SdkEditorModule``` on iOS.
```swift
let photoEditorSDK = BanubaPhotoEditor(
          token: token,
          ...
      )
```
Please note that the instance ```photoEditorSDK``` can be **nil** if the license token is incorrect.

Next, to start the Photo Editor SDK from React Native use ```openIosPhotoEditor()``` method defined in [App.js](../App.js#L39).
It will open the Photo Editor SDK from gallery screen.
```javascript
async function openPhotoEditor() {
  SdkEditorModule.initPhotoEditorSDK(LICENSE_TOKEN);
  return await SdkEditorModule.openPhotoEditor();
}

<Button
  style={[styles.button, styles.photoButton]}
  onPress={async () => {
      openPhotoEditor()
        .then(response => console.log('Exported photo = ' + response?.photoUri))
        .catch(e => this.handleSdkError(e));
  }}
>

 ```
Export returns the [photoUri](../App.js#L110) path as a ```String``` value of local URL that leads to exported photo in ```.png``` format.