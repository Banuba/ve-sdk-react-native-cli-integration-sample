# Android Video Editor SDK quickstart

This guide demonstrates how to quickly integrate Android Video Editor SDK into React Native project.
The main part of an integration and customization is implemented in ```android``` directory
of React Native project using native Android development process.

Once complete you will be able to launch video editor in your React Native project.

- [Installation](#Installation)
- [Resources](#Resources)
- [Configuration](#Configuration)
- [Launch](#Launch)
- [Editor V2](#editor-v2)
- [Face AR Effects](#Face-AR-Effects)
- [Connect audio](#Connect-audio)

## Installation
GitHub Packages is used for downloading SDK modules.

Add repositories to [gradle](../android/build.gradle#L30) file in ```allprojects``` section.

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
                password = "\u0067\u0068\u0070\u005f\u004a\u0067\u0044\u0052\u0079\u0049\u0032\u006d\u0032\u004e\u0055\u0059\u006f\u0033\u0033\u006b\u0072\u0034\u0049\u0069\u0039\u0049\u006f\u006d\u0077\u0034\u0052\u0057\u0043\u0064\u0030\u0052\u0078\u006d\u0045\u0069"
            }
        }

        ...
    }
}
```

Specify the following ```packaging options``` in your [build gradle](../android/app/build.gradle#L130-L136) file:

```groovy
android {
...
    packagingOptions {
        jniLibs {
            useLegacyPackaging = true
        }
    }
...
}
```

Specify a list of dependencies in [gradle](../android/app/build.gradle#L145) file.
```groovy
    def banubaSdkVersion = '1.46.0'
    implementation "com.banuba.sdk:ffmpeg:5.3.0"
    implementation "com.banuba.sdk:camera-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:camera-ui-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:core-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:core-ui-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-flow-sdk:${banubaSdkVersion}"
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

1. [drawable-xhdpi](../android/app/src/main/res/drawable-xhdpi),
   [drawable-xxhdpi](../android/app/src/main/res/drawable-xxhdpi),
   [drawable-xxxhdpi](../android/app/src/main/res/drawable-xxxhdpi) are visual assets for color filter previews.

2. [styles.xml](../android/app/src/main/res/values/styles.xml) includes implementation of ```VideoCreationTheme``` of Video Editor SDK.

## Configuration

Next, specify ```VideoCreationActivity``` in your [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml#L46).
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
Process the result and pass it to [handler](../App.js#L56) on React Native side.

## Launch
Create Kotlin class ```BanubaSdkReactPackage``` and add [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/BanubaSdkReactPackage.kt#L13) to the list of modules.
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

Next, add ```BanubaSdkReactPackage```  to the list of packages in [Application](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.kt#L23) class
```kotlin
    override fun getPackages(): MutableList<ReactPackage> {
            val packages = PackageList(this).packages
            packages.add(BanubaSdkReactPackage())
            return packages
    }
```

[Promises](https://reactnative.dev/docs/native-modules-android#promises) feature is used to make a bridge between React Native and Android.

Invoke [initSDK](../App.js#L16) on React Native side to initialize Video Editor SDK with the license token.
```javascript
SdkEditorModule.initSDK(LICENSE_TOKEN);
```

Add [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L121) on Android side to initialize Video Editor SDK. 

```kotlin
@ReactMethod
fun initVideoEditorSDK(licenseToken: String, promise: Promise) {
    videoEditorSDK = BanubaVideoEditor.initialize(licenseToken)
    
    if (videoEditorSDK == null) {
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

> [!IMPORTANT]
> 1. Instance ```videoEditorSDK``` is ```null``` if the license token is incorrect. In this case you cannot use video editor. Check your license token.
> 2. It is highly recommended to [check license](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L349) if the license is active before starting Video Editor.

Finally, once the SDK in initialized you can invoke [openVideoEditor](../App.js#L26) message from React Native to Android

```javascript
await SdkEditorModule.openVideoEditor();
```

and add [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L154) on Android side to start Video Editor.

## Editor V2

To keep up with the latest developments and best practices, our team has completely redesigned the Video Editor SDK to be as convenient and enjoyable as possible.

### Integration

Create ```Bundle``` with Editor UI V2 configuration and pass [extras](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#54) to any [Video Editor start method](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#172).

```kotlin
 val extras = bundleOf(
    "EXTRA_USE_EDITOR_V2" to true
 )
```

## Face AR Effects

[Banuba Face AR SDK product](https://www.banuba.com/facear-sdk/face-filters) is used on camera and editor screens for applying various AR effects while making video content.
Any Face AR effect is a folder that includes a number of files required for Face AR SDK to play this effect.

> [!NOTE]
> Make sure preview.png file is included in effect folder. You can use this file as a preview for AR effect.

There are 3 options for adding and managing AR effects:

1. Store all effects by the path [assets/bnb-resources/effects](../android/app/src/main/assets/bnb-resources/) folder in the app.
2. Store color effects in [assets/bnb-resources/luts](../android/app/src/main/assets/bnb-resources/luts) folder in the app.
3. Use [AR Cloud](https://www.banuba.com/faq/what-is-ar-cloud) for storing effects on a server.

## Connect audio

This is an optional section in the integration process. In this section you will know how to connect audio to Video Editor.

### Connect Soundstripe

Set ```false``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L32)
and specify ```SoundstripeProvider``` in your [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L79)

> [!IMPORTANT]
> The feature is not activated by default. Please, contact Banuba representatives to know more about using this feature.

```kotlin
single<ContentFeatureProvider<TrackData, Fragment>>(named("musicTrackProvider")){
   SoundstripeProvider()
}
```
to use audio from [Soundstripe](https://www.soundstripe.com/) in Video Editor.

### Connect Mubert

Request API key from [Mubert](https://mubert.com/).  

> [!IMPORTANT]
> Banuba is not responsible for providing Mubert API key.

Set ```false``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L32)
and specify ```MubertApiConfig``` in your [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L79)
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

### Connect Banuba Music

Set ```false``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L32)
and specify ```BanubaMusicProvider``` in your [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L79)

> [!IMPORTANT]
> The feature is not activated by default. Please, contact Banuba representatives to know more about using this feature.

```kotlin
single<ContentFeatureProvider<TrackData, Fragment>>(named("musicTrackProvider")){
   BanubaMusicProvider()
}
```
to use audio from ```Banuba Music``` in Video Editor.

### Connect External Audio API
Video Editor SDK allows to implement your experience for providing audio tracks using [External Audio API](https://docs.banuba.com/ve-pe-sdk/docs/android/guide_audio_content#connect-external-api).  
To check out the simplest experience you can set ```true``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L33)

> [!IMPORTANT]
> Video Editor SDK can play only audio tracks stored on the device.

More information is available in our [audio content](https://docs.banuba.com/ve-pe-sdk/docs/android/guide_audio_content) guide.
