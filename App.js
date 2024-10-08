import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Platform,
  NativeModules,
  TouchableOpacity
} from 'react-native';
const {SdkEditorModule} = NativeModules;

// Set Banuba license token for Video and Photo Editor SDK
const LICENSE_TOKEN = SET LICENSE TOKEN

function initVideoEditorSDK() {
  SdkEditorModule.initVideoEditorSDK(LICENSE_TOKEN);
}

function initPhotoEditorSDK() {
  SdkEditorModule.initPhotoEditorSDK(LICENSE_TOKEN);
}

async function openVideoEditor() {
  initVideoEditorSDK();
  return await SdkEditorModule.openVideoEditor();
}

async function openVideoEditorPIP() {
  initVideoEditorSDK();
  return await SdkEditorModule.openVideoEditorPIP();
}

async function openVideoEditorTrimmer() {
  initVideoEditorSDK();
  return await SdkEditorModule.openVideoEditorTrimmer();
}

async function openPhotoEditor() {
  if (Platform.OS === 'android') {
    SdkEditorModule.releaseVideoEditor();
  }
  SdkEditorModule.initPhotoEditorSDK(LICENSE_TOKEN);
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
      + response?.previewUri + '; photoUri = ' + response?.photoUri);
  }

  handleSdkError(e) {
    console.log('handle sdk error = ' + e.code);

    var message = '';
    switch (e.code) {
      case 'ERR_SDK_NOT_INITIALIZED':
        message = 'Banuba Video Editor SDK is not initialized: license token is unknown or incorrect.\nPlease check your license token or contact Banuba';
        break;
      case 'ERR_SDK_EDITOR_LICENSE_REVOKED':
        message = 'License is revoked or expired. Please contact Banuba https://www.banuba.com/support';
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
    this.setState({ errorText: message });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Sample integration of Banuba Video and Photo Editor into React Native
          </Text>
        </View>

        <View style={styles.buttonsWrapper}>
          <View style={styles.buttonsContainer}>
            {this.state.errorText ? (
              <Text style={styles.errorText}>{this.state.errorText}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, styles.photoButton]}
              onPress={async () => {
                  openPhotoEditor()
                    .then(response => console.log('Exported photo = ' + response?.photoUri))
                    .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Photo Editor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                openVideoEditor()
                  .then(response => this.handleVideoExport(response))
                  .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - Default</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                openVideoEditorPIP()
                  .then(response => this.handleVideoExport(response))
                  .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - PIP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                openVideoEditorTrimmer()
                  .then(response => this.handleVideoExport(response))
                  .catch(e => this.handleSdkError(e));
              }}
            >
              <Text style={styles.buttonText}>Open Video Editor - Trimmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerContainer: {
    height: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonsWrapper: {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    marginVertical: 8,
  },
  photoButton: {
    backgroundColor: '#00ab41',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});