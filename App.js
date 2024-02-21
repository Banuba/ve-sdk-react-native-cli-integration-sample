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

// Set Banuba license token for Video Editor SDK
const LICENSE_TOKEN = SET LICENSE TOKEN

const ERR_SDK_NOT_INITIALIZED_CODE = 'ERR_SDK_EDITOR_NOT_INITIALIZED';
const ERR_SDK_NOT_INITIALIZED_MESSAGE = 'Banuba Video Editor SDK is not initialized: license token is unknown or incorrect.\nPlease check your license token or contact Banuba';

const ERR_LICENSE_REVOKED_CODE = 'ERR_SDK_EDITOR_LICENSE_REVOKED';
const ERR_LICENSE_REVOKED_MESSAGE = 'License is revoked or expired. Please contact Banuba https://www.banuba.com/faq/kb-tickets/new';

function initSDK() {
  SdkEditorModule.initVideoEditor(LICENSE_TOKEN);
}

async function startIosVideoEditor() {
  initSDK();
  return await SdkEditorModule.openVideoEditor();
}

async function startIosVideoEditorPIP() {
  initSDK();
  return await SdkEditorModule.openVideoEditorPIP();
}

async function startIosVideoEditorTrimmer() {
  initSDK();
  return await SdkEditorModule.openVideoEditorTrimmer();
}

async function startIosPhotoEditor() {
  await SdkEditorModule.initPhotoEditor(LICENSE_TOKEN);
  return await SdkEditorModule.openPhotoEditor();
}

async function startAndroidVideoEditorTrimmer() {
  initSDK();
  return await SdkEditorModule.openVideoEditorTrimmer();
}

async function startAndroidVideoEditor() {
  initSDK();
  return await SdkEditorModule.openVideoEditor();
}

async function startAndroidVideoEditorPIP() {
  initSDK();
  return await SdkEditorModule.openVideoEditorPIP();
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

  handleExportException(e) {
    var message = '';
    switch (e.code) {
      case ERR_SDK_NOT_INITIALIZED_CODE:
        message = ERR_SDK_NOT_INITIALIZED_MESSAGE;
        break;
      case ERR_LICENSE_REVOKED_CODE:
        message = ERR_LICENSE_REVOKED_MESSAGE;
        break;
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={{padding: 16, textAlign: 'center'}}>
          Sample integration of Banuba Video Editor into React Native CLI
          project
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
                            this.handleExportException(e);
                          });
                      } else {
                        startIosPhotoEditor()
                          .then(response => {
                            console.log('Exported photo = ' + response?.photoUri);
                          })
                          .catch(e => {
                            this.handleExportException(e);
                          });
                      }
                    }}
                  />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - Default"
            onPress={async () => {
              if (Platform.OS === 'android') {
                startAndroidVideoEditor()
                  .then(videoUri => {
                    console.log('Exported video = ' +videoUri,);
                  })
                  .catch(e => {
                    this.handleExportException(e);
                  });
              } else {
                startIosVideoEditor()
                  .then(response => {
                    const exportedVideoUri = response?.videoUri;
                    const exportedVideoPreviewUri = response?.previewUri;
                    console.log(
                      'Banuba iOS Video Editor export video completed successfully. Video uri = '
                      + exportedVideoUri
                      + ' previewUri = '
                      + exportedVideoPreviewUri,
                    );
                  })
                  .catch(e => {
                    this.handleExportException(e);
                  });
              }
            }}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - PIP"
            onPress={async () => {
              if (Platform.OS === 'android') {
                startAndroidVideoEditorPIP()
                  .then(videoUri => {
                    console.log(
                      'Banuba Android Video Editor export video completed successfully. Video uri = ' +
                        videoUri,
                    );
                  })
                  .catch(e => {
                    this.handleExportException(e);
                  });
              } else {
                startIosVideoEditorPIP()
                  .then(response => {
                    const exportedVideoUri = response?.videoUri;
                    const exportedVideoPreviewUri = response?.previewUri;
                    console.log(
                      'Banuba iOS Video Editor export video completed successfully. Video uri = '
                      + exportedVideoUri
                      + ' previewUri = '
                      + exportedVideoPreviewUri,
                    );
                  })
                  .catch(e => {
                    this.handleExportException(e);
                  });
              }
            }}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <Button
            title="Open Video Editor - Trimmer"
            onPress={async () => {
              if (Platform.OS === 'android') {
                startAndroidVideoEditorTrimmer()
                  .then(videoUri => {
                    console.log(
                      'Banuba Android Video Editor export video completed successfully. Video uri = ' +
                        videoUri,
                    );
                  })
                  .catch(e => {
                    this.handleExportException(e);
                  });
              } else {
                startIosVideoEditorTrimmer()
                  .then(response => {
                    const exportedVideoUri = response?.videoUri;
                    const exportedVideoPreviewUri = response?.previewUri;
                    console.log(
                      'Banuba iOS Video Editor export video completed successfully. Video uri = '
                      + exportedVideoUri
                      + ' previewUri = '
                      + exportedVideoPreviewUri,
                    );
                  })
                  .catch(e => {
                    this.handleExportException(e);
                  });
              }
            }}
          />
        </View>
      </View>
    );
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
