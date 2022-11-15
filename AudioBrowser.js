import React from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Platform,
  NativeModules,
} from 'react-native';

const {VideoEditorModule} = NativeModules;

async function applyLocalAudio() {
  // Invokes native Android Video Editor integration module that will pass your prepared audio file to Video Editor SDK.
  // You can override "VideoEditorModule.applyAudioTrack()" to pass your custom audio data from React Native to Android.
  return await VideoEditorModule.applyAudioTrack();
}

// Simple Screen to show how to pass and apply audio in Video Editor SDK.
// You can implement you own screen with browsing and downloading audio files.
// Audio file MUST BE stored to device storage before using in Video Editor SDK.
export default function AudioBrowser() {
  return (
    <View style={styles.container}>
      <Text style={{padding: 16, textAlign: 'center'}}>
        Local audio file is used to demonstrate how to play audio in Video
        Editor SDK
      </Text>

      <Button
        title="Use Local Audio"
        onPress={async () => {
          if (Platform.OS === 'android') {
            applyLocalAudio();
          } else {
            console.log('Platform implementation is not supported yet!');
          }
        }}
      />
    </View>
  );
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
