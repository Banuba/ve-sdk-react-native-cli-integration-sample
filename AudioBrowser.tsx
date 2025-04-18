import React from 'react';
import {
    StyleSheet,
    Text,
    Button,
    View,
    Platform,
    NativeModules,
} from 'react-native';

const { SdkEditorModule } = NativeModules;

async function applyAudioTrack() {
    // Invokes native Android Video Editor integration module that will pass your prepared audio file to Video Editor SDK.
    // You can override "VideoEditorModule.applyAudioTrack()" to pass your custom audio data from React Native to Android.
    return await SdkEditorModule.applyAudioTrack();
}

async function discardAudioTrack() {
    return await SdkEditorModule.discardAudioTrack();
}

async function close() {
    return await SdkEditorModule.closeAudioBrowser();
}

// Simple Screen to show how to pass and apply audio in Video Editor SDK.
// You can implement you own screen with browsing and downloading audio files.
// Audio file MUST BE stored to device storage before using in Video Editor SDK.
export default function AudioBrowser() {
    return (
        <View style={styles.container}>
            <Text style={{ padding: 16, textAlign: 'center' }}>
                Local audio file is used to demonstrate how to play audio in Video
                Editor SDK
            </Text>

            <View style={{ marginVertical: 16, width: 220 }}>
                <Button
                    title="Apply audio track"
                    onPress={async () => {
                        applyAudioTrack();
                    }}
                />
            </View>

            <View style={{ marginVertical: 16, width: 220 }}>
                <Button
                    title="Discard audio track"
                    color="#f44339"
                    onPress={async () => {
                        discardAudioTrack();
                    }}
                />
            </View>

            <View style={{ marginVertical: 16, width: 220 }}>
                <Button
                    title="Close"
                    color="#9e9e9e"
                    onPress={async () => {
                        close();
                    }}
                />
            </View>
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