import React, {Component} from 'react';

// Use to access video files https://github.com/react-native-image-picker/react-native-image-picker/tree/main
import {launchImageLibrary} from 'react-native-image-picker';

import {
  StyleSheet,
  Text,
  Button,
  View,
  Platform,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
const {SdkEditorModule} = NativeModules;

// Set Banuba license token for Video and Photo Editor SDK
const LICENSE_TOKEN = SET LICENSE TOKEN

function initSDK() {
  SdkEditorModule.initSDK(LICENSE_TOKEN);
}

async function openVideoEditor() {
  initSDK();
  return await SdkEditorModule.openVideoEditor();
}

async function openVideoEditorPIP() {
  initSDK();

  // PLEASE GRANT ALL PERMISSIONS TO PROCEED
  await grantMediaPermissions()

  const videoOptions: ImageLibraryOptions = {
        mediaType: 'video',
        videoQuality: 'high',
        formatAsMp4: true,
        quality: 1,
        includeBase64: false,
        selectionLimit: 1,
        durationLimit: 0,
   };

   const result = await launchImageLibrary(videoOptions);

   const videoPath = result.assets[0].originalPath
   const videoUri = result.assets[0].uri
   console.log('Open video editor in pip mode with video: path = ' + videoPath + ', uri = ' + videoUri);

   // IMPORTANT
   // videoPath requirements
   // 1. Android
   //   a. when video is taken from Gallery. Example, /storage/emulated/0/Movies/sample.mp4
   //   b. in app directory - IN PROGRESS
   // 2. iOS
   return await SdkEditorModule.openVideoEditorPIP(videoPath);
}

async function openVideoEditorTrimmer() {
  initSDK();

  // PLEASE GRANT ALL PERMISSIONS TO PROCEED
    await grantMediaPermissions()

    const videoOptions: ImageLibraryOptions = {
          mediaType: 'video',
          videoQuality: 'high',
          formatAsMp4: true,
          quality: 1,
          includeBase64: false,
          selectionLimit: 1,
          durationLimit: 0,
     };

     const result = await launchImageLibrary(videoOptions);

     const videoPath = result.assets[0].originalPath
     const videoUri = result.assets[0].uri
     console.log('Open video editor in Trimmer mode with video: path = ' + videoPath + ', uri = ' + videoUri);

     // IMPORTANT
     // videoPath requirements
     // 1. Android
     //   a. when video is taken from Gallery. Example, /storage/emulated/0/Movies/sample.mp4
     //   b. in app directory - IN PROGRESS
     // 2. iOS
  return await SdkEditorModule.openVideoEditorTrimmer(videoPath);
}

async function openIosPhotoEditor() {
  await SdkEditorModule.initPhotoEditor(LICENSE_TOKEN);
  return await SdkEditorModule.openPhotoEditor();
}

async function openAndroidPhotoEditor() {
  initSDK();
  return await SdkEditorModule.openPhotoEditor();
}

const grantMediaPermissions = async () => {
  const status = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
  ]);

  return status
};

export default class App extends Component {
  
  constructor() {
    super();
    this.state = {
      errorText: '',
    };
  }

  handleVideoExport(response) {
    console.log('Export completed successfully: video = ' + response?.videoUri + '; videoPreview = '
        + response?.previewUri);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{padding: 16, textAlign: 'center', fontSize: 18 }}>
          Sample integration of Banuba Video and Photo Editor into React Native
        </Text>

        <Text
          style={{
            padding: 16,
            textAlign: 'center',
            color: '#ff0000',
            fontSize: 16,
            fontWeight: '800',
          }}>
          {this.state.errorText}
        </Text>

        <View style={{marginVertical: 8}}>
            <Button
               title="Open Photo Editor"
               color="#00ab41"
                onPress={async () => {
                      if (Platform.OS === 'android') {
                        openAndroidPhotoEditor()
                          .then(response => {
                            console.log('Exported photo = ' + response?.photoUri);
                          })
                          .catch(e => {
                            this.handleSdkError(e);
                          });
                      } else {
                        openIosPhotoEditor()
                          .then(response => {
                            console.log('Exported photo = ' + response?.photoUri);
                          })
                          .catch(e => {
                            this.handleSdkError(e);
                          });
                      }
                    }}
                  />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - Default"
            onPress={async () => {
                 openVideoEditor()
                    .then(response => { this.handleVideoExport(response); })
                    .catch(e => { this.handleSdkError(e); });
            }}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - PIP"
            onPress={async () => {
                openVideoEditorPIP()
                    .then(response => { this.handleVideoExport(response); })
                    .catch(e => { this.handleSdkError(e); });
            }}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - Trimmer"
            onPress={async () => {
                openVideoEditorTrimmer()
                    .then(response => { this.handleVideoExport(response); })
                    .catch(e => { this.handleSdkError(e); });
            }}
          />
        </View>
      </View>
    );
  }

  handleSdkError(e) {
      console.log('handle sdk error = ' + e.code);

      var message = '';
      switch (e.code) {
        case 'ERR_SDK_NOT_INITIALIZED':
          message = 'Banuba Video Editor SDK is not initialized: license token is unknown or incorrect.\nPlease check your license token or contact Banuba';
          break;
        case 'ERR_SDK_EDITOR_LICENSE_REVOKED':
          message = 'License is revoked or expired. Please contact Banuba https://www.banuba.com/faq/kb-tickets/new';
          break;
        case 'ERR_MISSING_EXPORT_RESULT':
          message = 'Missing video export result!';
        case 'ERR_CODE_NO_HOST_CONTROLLER':
          message = "Host Activity or ViewController does not exist!";
        case 'ERR_VIDEO_EXPORT_CANCEL':
          message = "Video export is canceled";
        default:
          message = '';
          console.log(
            'Banuba ' +
              Platform.OS.toUpperCase() +
              ' Video Editor export video failed = ' +
              e,
          );
          break;
      }
      this.setState({errorText: message});
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
