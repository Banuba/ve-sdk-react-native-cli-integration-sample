# iOS Photo Editor SDK quickstart

This guide demonstrates how to quickly integrate iOS Photo Editor SDK into your React Native project.
The main part of an integration and customization is implemented in ```ios``` directory
in your React Native project using native iOS development process.

Once complete you will be able to launch photo editor in your React Native project.

## Installation

Add iOS Photo Editor SDK dependency ```pod 'BanubaPhotoEditorSDK', '1.2.0'``` to your [Podfile](../ios/Podfile).

## Launch
First, initialize the Photo Editor SDK using the license token in ```SdkEditorModule``` on iOS.
```swift
let photoEditorSDK = BanubaPhotoEditor(
          token: token,
          ...
      )
```
Please note that the instance ```photoEditorSDK``` can be **nil** if the license token is incorrect.

Next, to start the Photo Editor SDK from React Native use ```openIosPhotoEditor()``` method defined in [App.js](../App.js#L34).
It will open the Photo Editor SDK from gallery screen.
```javascript
async function openIosPhotoEditor() {
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
Export returns the [photoUri](../App.js#L92) path as a ```String``` value of local URL that leads to exported photo in ```.png``` format.