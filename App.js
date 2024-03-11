import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Platform,
  NativeModules,
} from 'react-native';
const {SdkEditorModule} = NativeModules;

// Set Banuba license token for Video and Photo Editor SDK
const LICENSE_TOKEN = SET LICENSE TOKEN

function initSDK() {
  SdkEditorModule.initSDK(LICENSE_TOKEN);
}

async function startVideoEditor() {
  initSDK();
  return await SdkEditorModule.openVideoEditor();
}

async function startVideoEditorPIP() {
  initSDK();
  return await SdkEditorModule.openVideoEditorPIP();
}

async function startVideoEditorTrimmer() {
  initSDK();
  return await SdkEditorModule.openVideoEditorTrimmer();
}

async function startIosPhotoEditor() {
  await SdkEditorModule.initPhotoEditor(LICENSE_TOKEN);
  return await SdkEditorModule.openPhotoEditor();
}

async function startAndroidPhotoEditor() {
  initSDK();
  return await SdkEditorModule.openPhotoEditor();
}

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
                        startAndroidPhotoEditor()
                          .then(response => {
                            console.log('Exported photo = ' + response?.photoUri);
                          })
                          .catch(e => {
                            this.handleSdkError(e);
                          });
                      } else {
                        startIosPhotoEditor()
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
                 startVideoEditor()
                    .then(response => { this.handleVideoExport(response); })
                    .catch(e => { this.handleSdkError(e); });
            }}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - PIP"
            onPress={async () => {
                startVideoEditorPIP()
                    .then(response => { this.handleVideoExport(response); })
                    .catch(e => { this.handleSdkError(e); });
            }}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - Trimmer"
            onPress={async () => {
                startVideoEditorTrimmer()
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
