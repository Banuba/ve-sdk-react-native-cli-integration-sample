# Android Video Editor SDK quickstart

This guide demonstrates how to quickly integrate Android Video Editor SDK into React Native project.
The main part of an integration and customization is implemented in ```android``` directory
of React Native project using native Android development process.

Once complete you will be able to launch video editor in your React Native project.

- [Installation](#Installation)
- [Resources](#Resources)
- [Configuration](#Configuration)
- [Launch](#Launch)
- [Connect audio](#Connect-audio)
- [What is next?](#What-is-next)


## Installation
GitHub Packages is used for downloading Android Video Editor SDK modules.

First, add repositories to [gradle](../android/build.gradle#L28) file in ```allprojects``` section.

```groovy
...

allprojects {
    repositories {
        ...

        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/Banuba/banuba-ve-sdk")
            credentials {
                username = "Banuba"
                password = "\u0038\u0036\u0032\u0037\u0063\u0035\u0031\u0030\u0033\u0034\u0032\u0063\u0061\u0033\u0065\u0061\u0031\u0032\u0034\u0064\u0065\u0066\u0039\u0062\u0034\u0030\u0063\u0063\u0037\u0039\u0038\u0063\u0038\u0038\u0066\u0034\u0031\u0032\u0061\u0038"
            }
        }
        maven {
            name = "ARCloudPackages"
            url = uri("https://maven.pkg.github.com/Banuba/banuba-ar")
            credentials {
                username = "Banuba"
                password = "\u0038\u0036\u0032\u0037\u0063\u0035\u0031\u0030\u0033\u0034\u0032\u0063\u0061\u0033\u0065\u0061\u0031\u0032\u0034\u0064\u0065\u0066\u0039\u0062\u0034\u0030\u0063\u0063\u0037\u0039\u0038\u0063\u0038\u0038\u0066\u0034\u0031\u0032\u0061\u0038"
            }
        }
        maven {
            name "GitHubPackagesEffectPlayer"
            url "https://maven.pkg.github.com/sdk-banuba/banuba-sdk-android"
            credentials {
                username = "sdk-banuba"
                password = "\u0067\u0068\u0070\u005f\u0033\u0057\u006a\u0059\u004a\u0067\u0071\u0054\u0058\u0058\u0068\u0074\u0051\u0033\u0075\u0038\u0051\u0046\u0036\u005a\u0067\u004f\u0041\u0053\u0064\u0046\u0032\u0045\u0046\u006a\u0030\u0036\u006d\u006e\u004a\u004a"
            }
        }

        ...
    }
}
```

Next, specify a list of dependencies in [gradle](../android/app/build.gradle#L148) file.
```groovy
    def banubaSdkVersion = '1.34.0'
    implementation "com.banuba.sdk:ffmpeg:5.1.3"
    implementation "com.banuba.sdk:camera-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:camera-ui-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:core-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:core-ui-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-flow-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-timeline-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-ui-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-gallery-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-effects-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:effect-player-adapter:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ar-cloud:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-audio-browser-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-export-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-playback-sdk:${banubaSdkVersion}"
```

Additionally, make sure the following plugins are in your app [gradle](../android/app/build.gradle#L2) file.
```groovy
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-parcelize'
```

## Resources
Video Editor SDK uses a lot of resources required for running in the app.  
Please make sure all these resources exist in your project.

1. [bnb-resources](../android/app/src/main/assets/bnb-resources)  Banuba AR and color filters. AR effects ```assets/bnb-resources/effects``` requires [Face AR](https://docs.banuba.com/face-ar-sdk-v1) product.

2. [drawable-xhdpi](../android/app/src/main/res/drawable-xhdpi),
   [drawable-xxhdpi](../android/app/src/main/res/drawable-xxhdpi),
   [drawable-xxxhdpi](../android/app/src/main/res/drawable-xxxhdpi) are visual assets for color filter previews.

3. [styles.xml](../android/app/src/main/res/values/styles.xml) includes implementation of ```VideoCreationTheme``` of Video Editor SDK.

## Configuration

Next, specify ```VideoCreationActivity``` in your [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml#L53).
This Activity combines a number of screens into video editor flow.

```xml
<activity
android:name="com.banuba.sdk.ve.flow.VideoCreationActivity"
android:screenOrientation="portrait"
android:theme="@style/CustomIntegrationAppTheme"
android:windowSoftInputMode="adjustResize"
tools:replace="android:theme" />
```

Next, allow Network by adding permissions
```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
```
and ```android:usesCleartextTraffic="true"``` in [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml).

Network access is used for downloading AR effects from AR Cloud and stickers from [Giphy](https://giphy.com/).

Please set up correctly [network security config](https://developer.android.com/training/articles/security-config) and use of ```android:usesCleartextTraffic```
by following [guide](https://developer.android.com/guide/topics/manifest/application-element).

Create new Kotlin class [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt) in your project
for initializing and customizing Video Editor SDK features.

### Export media
Video Editor SDK exports single video with auto quality by default. Auto quality is based on device hardware capabilities.

Every exported media is passed to  [onActivityResult](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L49) method.
Process the result and pass it to [handler](../App.js#L161) on React Native side.

## Launch
Create [BanubaSdkReactPackage](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/BanubaSdkReactPackage.kt) and add [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt) to the list of modules.
```kotlin
 class BanubaSdkReactPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
        val modules = mutableListOf<NativeModule>()
        modules.add(SdkEditorModule(reactContext))
        return modules
    }
    ...
}
```

Next, add ```BanubaSdkReactPackage```  to the list of packages in [Application](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.java#L26) class
```java
        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new BanubaSdkReactPackage());
            ...
            return packages;
        }
```


[Promises](https://reactnative.dev/docs/native-modules-android#promises) feature is used to make a bridge between React Native and Android.

Invoke [initSDK](../App.js#L15) on React Native side to initialize Video Editor SDK with the license token.
```javascript
SdkEditorModule.initSDK(LICENSE_TOKEN);
```

Add [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L114) on Android side to initialize Video Editor SDK. 

```kotlin
    @ReactMethod
    fun initVideoEditor(licenseToken: String, promise: Promise) {
        editorSDK = BanubaVideoEditor.initialize(licenseToken)

        if (editorSDK == null) {
            // Token you provided is not correct - empty or truncated
            Log.e(TAG, "SDK is not initialized!")
            promise.reject(ERR_CODE_NOT_INITIALIZED, "")
        } else {
            if (integrationModule == null) {
            // Initialize video editor sdk dependencies
            integrationModule = VideoEditorIntegrationModule().apply {
                initialize(reactApplicationContext.applicationContext)
            }
        }
        promise.resolve(null)
   }
}
```

:exclamation: Important
1. Instance ```editorSDK``` is ```null``` if the license token is incorrect. In this case you cannot use photo editor. Check your license token.
2. It is highly recommended to [check license](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L318) if the license is active before starting Photo Editor.

Finally, once the SDK in initialized you can invoke [openVideoEditor](../App.js#L19) message from React Native to Android

```javascript
await SdkEditorModule.openVideoEditor();
```

and add [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L137) on Android side to start Video Editor.

## Connect audio

This is an optional section in integration process. In this section you will know how to connect audio to Video Editor.

### Connect Soundstripe
Set ```false``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L62)
and specify ```SoundstripeProvider``` in your [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L76)

```kotlin
single<ContentFeatureProvider<TrackData, Fragment>>(named("musicTrackProvider")){
   SoundstripeProvider()
}
```
to use audio from [Soundstripe](https://www.soundstripe.com/) in Video Editor.

### Connect Mubert

Request API key from [Mubert](https://mubert.com/).  
:exclamation:  Banuba is not responsible for providing Mubert API key.

Set ```false``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L62)
and specify ```MubertApiConfig``` in your [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L76)
```kotlin
single {
   MubertApiConfig(
      mubertLicence = "...",
      mubertToken = "..."
   )
}

single<ContentFeatureProvider<TrackData, Fragment>>(named("musicTrackProvider")) {
   AudioBrowserMusicProvider()
}
```
to use audio from [Mubert](https://mubert.com/) in Video Editor.

### Connect External Audio API
Video Editor SDK allows to implement your experience of providing audio tracks using [External Audio API](https://docs.banuba.com/ve-pe-sdk/docs/android/guide_audio_content#connect-external-api).  
To check out the simplest experience on Flutter you can set ```true``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L62)

:exclamation: Important  
Video Editor SDK can play only audio tracks stored on the device.

More information is available in our [audio content](https://docs.banuba.com/ve-pe-sdk/docs/android/guide_audio_content) guide.

## What is next?
This quickstart guide has just covered how to quickly integrate Android Video Editor SDK,
it is considered you managed to start video editor from your Flutter project.

Please check out [docs](https://docs.banuba.com/ve-pe-sdk/docs/android/requirements-ve/) to know more about the SDK and complete full integration.
