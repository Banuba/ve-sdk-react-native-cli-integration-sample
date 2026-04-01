# Video Editor Quickstart on Android

This guide walks you through integrating the Android Video Editor SDK into your React Native project. Integration and customization are performed in the `android` directory using native Android development practices.


- [Installation](#Installation)
- [Resources](#Resources)
- [AndroidManifest Updates](#AndroidManifest-Updates)
- [Koin Module Setup](#Koin-Module-Setup)
- [Launch](#Launch)
- [Editor V2](#editor-v2)
- [Face AR Effects](#Face-AR-Effects)
- [Connect audio](#Connect-audio)

## Installation
Add the Banuba repository to your project using **either** Groovy **or** Kotlin DSL:

**Groovy** (in project's [build.gradle](../android/build.gradle#L31))

```groovy
...

allprojects {
    repositories {
       ...
       maven {
          name = "nexus"
          url = uri("https://nexus.banuba.net/repository/maven-releases")
       }
    }
}
```
or

**Kotlin** (settings.gradle.kts)
```kotlin
...
dependencyResolutionManagement {
   repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
   repositories {
      ...
      maven {
         name = "nexus"
         url = uri("https://nexus.banuba.net/repository/maven-releases")
      }
   }
}
```

Specify ```packagingOptions``` in your [build gradle](../android/app/build.gradle#L130-L136):

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

Add dependencies to your app's [gradle](../android/app/build.gradle#L155)
```groovy
    def banubaSdkVersion = '1.51.0'
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

Ensure these plugins are in your app's [gradle](../android/app/build.gradle#L1).
```groovy
   plugins {
        id "com.android.application"
        id "kotlin-android"
        id "kotlin-parcelize"
}
```

## AndroidManifest Updates

Add the following to your [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml#L47):

1. ```VideoCreationActivity``` – orchestrates the video editor screens
``` xml
<activity android:name="com.banuba.sdk.ve.flow.VideoCreationActivity"
    android:screenOrientation="portrait"
    android:theme="@style/VideoCreationTheme"
    android:windowSoftInputMode="adjustResize"
    tools:replace="android:theme" />
```  

 **Important**  
 Add [CustomIntegrationAppTheme](../android/app/src/main/res/values/styles.xml#L12) styles resource file.

2. **Network permissions** (optional)– only required if using [Giphy](https://giphy.com/) stickers or downloading AR effects from the cloud.
```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
```

**Note:** You'll also need a custom VideoCreationTheme [example](../android/app/src/main/res/values/styles.xml#L12) to style the editor UI.

Please set up correctly [network security config](https://developer.android.com/training/articles/security-config) and use of ```android:usesCleartextTraffic```
by following [guide](https://developer.android.com/guide/topics/manifest/application-element).


## Koin Module Setup

1. Create [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt) to initialize and customize the Video Editor SDK.
2. Inside it, add [SampleModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L64) with your customizations:

``` diff
class VideoEditorIntegrationModule {

   ...

    fun initialize(applicationContext: Context) {
        startKoin {
            androidContext(applicationContext)
            allowOverride(true)

            // IMPORTANT! order of modules is required
            modules(
                VeSdkKoinModule().module,
                VeExportKoinModule().module,
                VePlaybackSdkKoinModule().module,

                // Use AudioBrowserKoinModule ONLY if your contract includes this feature.
                AudioBrowserKoinModule().module,

                // IMPORTANT! ArCloudKoinModule should be set before TokenStorageKoinModule to get effects from the cloud
                ArCloudKoinModule().module,

                VeUiSdkKoinModule().module,
                VeFlowKoinModule().module,
                BanubaEffectPlayerKoinModule().module,
                GalleryKoinModule().module,

                // Sample integration module
+                SampleModule().module,
            )
        }
    }
}

+ private class SampleModule {

    val module = module {
        single<ArEffectsRepositoryProvider>(createdAtStart = true) {
            ArEffectsRepositoryProvider(
                arEffectsRepository = get(named("backendArEffectsRepository"))
            )
        }

        // Audio Browser provider implementation.
        single<ContentFeatureProvider<TrackData, Fragment>>(
            named("musicTrackProvider")
        ) {
            if (VideoEditorIntegrationModule.CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER) {
                AudioBrowserContentProvider()
            } else {
                // Default implementation that supports Local audio stored on the device
                AudioBrowserMusicProvider()
            }
        }
    }
}
```

### Export

The Video Editor SDK exports a single video with auto quality by default. Auto quality is based on device hardware capabilities.

Every exported media is passed to the [onActivityResult](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L59) method in MainActivity.kt.
Process the result there and forward it to the [handler](../App.tsx#L56) on React Native side.

## Launch

Create [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt) for communicating with the SDK.


Create ```BanubaSdkReactPackage``` class add add ```SdkEditorModule```  to the list of modules.
```diff
 class BanubaSdkReactPackage : ReactPackage {

    class BanubaSdkReactPackage : ReactPackage {
        override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> {
            val modules = mutableListOf<NativeModule>()
 +           modules.add(SdkEditorModule(reactContext))
            return modules
        }
        override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> =
            mutableListOf()
    }
}
```

Add  ```BanubaSdkReactPackage``` package [in the application](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.kt#L23)
```diff
    class MainApplication : Application(), ReactApplication {


    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> = PackageList(this).packages.apply {
+                add(BanubaSdkReactPackage())
            }

            ...
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        ...
    }
}
```

The [Promises](https://reactnative.dev/docs/native-modules-android#promises) pattern bridges React Native with Android native modules.

### Init SDK
On the React Native side, call [initSDK](../App.js#L16) to initialize the SDK with your license token:
```javascript
SdkEditorModule.initSDK(LICENSE_TOKEN);
```
On the Android side, implement the [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L140) that initializes the Video Editor SDK. 

### Start

After SDK initialization, invoke [openVideoEditor](../App.tsx#L24) from React Native to start Video Editor:

```javascript
await SdkEditorModule.openVideoEditor();
```
On the Android side, implement the [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L159) to start Video Editor.

```kotlin
    @ReactMethod
fun openVideoEditor(promise: Promise) {
   checkLicenseVideoEditor(callback = { isValid ->
      if (isValid) {
         // ✅ The license is active
         val hostActivity = currentActivity
         if (hostActivity == null) {
            // Activity is not connected
         } else {
            this.resultPromise = promise
            val intent = VideoCreationActivity.startFromCamera(
               hostActivity,
               PipConfig(video = Uri.EMPTY, openPipSettings = false),
               extras = extras
            )
            hostActivity.startActivityForResult(intent, OPEN_VIDEO_EDITOR_REQUEST_CODE)
         }
      } else {
         // ❌ Use of SDK is restricted: the license is revoked or expired
      }
   }, onError = { 
       // Verify license
   })
}
```

> [!IMPORTANT]
> 1. Returns ```null```l if the license token is invalid – verify your token
> 2. [Check license activation](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L353) before starting the editor.
> 3. Expired/revoked licenses show a "Video content unavailable" screen


## Editor V2

To keep up with the latest developments and best practices, our team has completely redesigned the Video Editor SDK to be as convenient and enjoyable as possible.


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

This section describes how to connect custom audio tracks to the Video Editor SDK. This is an optional step in the integration process.

### Connect External Audio API

Video Editor SDK allows to implement your experience of providing your audio tracks using [External Audio API](https://docs.banuba.com/ve-pe-sdk/docs/android/guide_audio_content#connect-external-api).

For a quick demonstration of this flow on React Native, you can enable the pre-configured custom audio browser
by setting [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L32) to ```true``` in ```VideoEditorIntegrationModule.kt```.

> [!IMPORTANT]  
> The Video Editor SDK can only play audio tracks that are stored locally on the device. You are responsible for downloading or providing the audio file to the correct local path before applying it.

For complete implementation details, including how to build a custom UI and handle audio selection callbacks, refer to the dedicated [Audio Content](https://docs.banuba.com/ve-pe-sdk/docs/android/guide_audio_content) guide.


### Connect Soundstripe
To use audio tracks from [Soundstripe](https://www.soundstripe.com/) in the Video Editor:

1. Set [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L32) to ```false``` in ```VideoEditorIntegrationModule.kt```

2. Specify ```SoundstripeProvider``` in your [VideoEditorIntegrationModule](.../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L73):

> [!IMPORTANT]
> This feature is not activated by default. Contact Banuba representatives for access.

```kotlin
single<ContentFeatureProvider<TrackData, Fragment>>(named("musicTrackProvider")){
   SoundstripeProvider()
}
```


### Connect Banuba Music
To use audio tracks from Banuba Music in the Video Editor:

1. Set [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L32) to ```false``` in ```VideoEditorIntegrationModule.kt```
2. Specify ```BanubaMusicProvider``` in your [VideoEditorIntegrationModule](.../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L73):

> [!IMPORTANT]
> This feature is not activated by default. Contact Banuba representatives for access.

```kotlin
single<ContentFeatureProvider<TrackData, Fragment>>(named("musicTrackProvider")){
   BanubaMusicProvider()
}
```

## Documentation
Explore the full capabilities of our [Video Editor SDK](https://docs.banuba.com/ve-pe-sdk/docs/android/requirements-ve)
