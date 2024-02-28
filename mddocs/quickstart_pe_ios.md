# iOS Photo Editor SDK quickstart

## Installation

Add iOS Photo Editor SDK dependency ```pod 'BanubaPhotoEditorSDK', '1.1.1'``` to your [Podfile](../ios/Podfile).

## Launch
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
Export returns the [photoUri](../App.js#L131) path as a ```String``` value of local URL that leads to exported photo in ```.png``` format.

## What is next?
We have covered a basic process of Banuba Photo Editor SDK integration into your React Native project.

Please check out [docs](https://docs.banuba.com/ve-pe-sdk/docs/ios/pe-requirements) to know more about the SDK and complete full integration.