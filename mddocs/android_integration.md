# Android Video Editor SDK quickstart

- [Overview](#Overview)
- [Prerequisites](#Prerequisites)
- [Add dependencies](#Add-dependencies)
- [Add module class](#Add-module-class)
- [Update AndroidManifest](#Update-AndroidManifest)
- [Add resources](#Add-resources)
- [Implement export](#Implement-export)
- [Init and start](#Init-and-start)
- [Enable custom Audio Browser experience](#Enable-custom-Audio-Browser-experience)
- [Connect Mubert](#Connect-Mubert)
- [Complete full integration](#Complete-full-integration)

## Overview
The following quickstart guide explains how to quickly integrate Android Video Editor SDK into your React Native CLI project.
The main part of an integration and customization is implemented in ```android``` directory
of your React Native CLI project using native Android development process.

You will be able to launch video editor from your React Native CLI project when you complete all these integration steps.

## Prerequisites
Complete [Installation](../README.md#Installation) guide to proceed.

## Add SDK dependencies
Add Banuba repositories in [gradle](../android/build.gradle#L30) file in ```allprojects``` section to get SDK dependencies.

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

Add Video Editor SDK dependencies in [app gradle](../android/app/build.gradle#L148) file.
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
    implementation "com.banuba.sdk:banuba-token-storage-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-export-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-playback-sdk:${banubaSdkVersion}"
```

## Add module class
Add [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt) file
to your project. Use this class to initialize and customize Video Editor SDK features.

Next, add [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt) for communicating
between React Native and Video Editor SDK.

Create ```BanubaSdkReactPackage``` and add [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt) to the list of modules.
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
Finally, add ```BanubaSdkReactPackage```  to list of packages in [Application](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.java#L31) class
```java
        @Override
        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new BanubaSdkReactPackage());
            ...
            return packages;
        }
```

## Update AndroidManifest
Add ```VideoCreationActivity``` in your [AndroidManifest.xml](../android/app/src/main/AndroidManifest.xml#L49) file.
This Activity joins a number of screens into video editor flow.

:exclamation:  Important  
It is possible to skip some screens, it is not possible to fully customize the order of screens.

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

Network traffic is used for downloading AR effects from AR Cloud and stickers from [Giphy](https://giphy.com/).

Please set up correctly [network security config](https://developer.android.com/training/articles/security-config) and use of ```android:usesCleartextTraffic```
by following [guide](https://developer.android.com/guide/topics/manifest/application-element).

## Add resources
Video Editor SDK consumes a lot of visual resources. Most part of the resources is delivered in the SDK.
Some resources depend on your project requirements and should be copied and pasted manually.

### Banuba resources
[bnb-resources](../android/app/src/main/assets/bnb-resources) Banuba AR and color filters. Use of AR effects ```assets/bnb-resources/effects``` requires [Face AR](https://docs.banuba.com/face-ar-sdk-v1) product.

### Android resources
- [drawable-hdpi](../android/app/src/main/res/drawable-hdpi),
- [drawable-xhdpi](../android/app/src/main/res/drawable-xhdpi),
- [drawable-xxhdpi](../android/app/src/main/res/drawable-xxhdpi),
- [drawable-xxxhdpi](../android/app/src/main/res/drawable-xxxhdpi) are visual assets for color filter previews.
- [styles.xml](../android/app/src/main/res/values/styles.xml) includes implementation of ```VideoCreationTheme``` of Video Editor SDK.

:bulb:  Hint
If you want to replace default resources i.e. icons you should add your custom
resources in folders described in [Android resources](#Android-resources). We recommend to keep resource names or override use of them in Android [styles](../android/app/src/main/res/values/styles.xml).

## Implement export
Video Editor SDK supports export multiple media files to meet your product requirements.
Create class [CustomExportParamsProvider](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L122)
and implement ```ExportParamsProvider``` to provide ```List<ExportParams>``` where every ```ExportParams``` is a media file i.e. video or audio.

Use ```ExportParams.Builder.fileName``` method to set custom media file name.

## Init and start
[Promises](https://reactnative.dev/docs/native-modules-android#promises) feature is used to make a bridge between Android and ReactNative.

### Init sdk
React Native should send [init message](../App.js#L22) to Android to initialize Video Editor SDK with the license token.
```javascript
function initVideoEditor() {
   VideoEditorModule.initVideoEditor(LICENSE_TOKEN);
}
```

Implement ```ReactMethod``` in [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L135)
to initialize video editor on Android side. ```BanubaVideoEditor.initialize(LICENSE_TOKEN)``` initializes Android Video Editor SDK with the license token.
```kotlin
class SdkEditorModule(reactContext: ReactApplicationContext) :
   ReactContextBaseJavaModule(reactContext) {
   ...
   @ReactMethod
   fun initVideoEditor(licenseToken: String, inputPromise: Promise) {
      videoEditorSDK = BanubaVideoEditor.initialize(licenseToken)

      if (videoEditorSDK == null) {
         // Token you provided is not correct - empty or truncated
         Log.e(TAG, ERR_SDK_NOT_INITIALIZED_MESSAGE)
         inputPromise.reject(ERR_SDK_NOT_INITIALIZED_CODE, ERR_SDK_NOT_INITIALIZED_MESSAGE)
      } else {
         if (integrationModule == null) {
            // Initialize video editor sdk dependencies
             integrationModule = VideoEditorIntegrationModule().apply {
               initialize(reactApplicationContext.applicationContext)
            }
         }
         inputPromise.resolve(null)
      }
   }
}
```

Instance of ```videoEditorSDK``` can be ```null``` if the license token is incorrect. In this
case you cannot use video editor. Please check your license token.

### Start sdk
:exclamation:  Important  
It is highly recommended to check the license state before using video editor.

When Video Editor is initialized successfully React Native should send [start message](../App.js#L43) to Android.
```javascript
async function startAndroidVideoEditor() {
  ...
  return await VideoEditorModule.openVideoEditor();
}
```

Implement ```ReactMethod``` in [SdkEditorModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L157)
on Android side to check license state and start video editor.

### Export result
Handle export result in [onActivityResult](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L44) and
pass the result to [React Native](../App.js#L111). In this sample, the first exported video file path as ```String``` returns.
You can customize it and return any result.

## Enable custom Audio Browser experience
Video Editor SDK allows to implement your experience of providing audio tracks - custom Audio Browser.  
To check out the simplest experience on Flutter you can set ```true``` to [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt#L62)

:exclamation:  Important  
Video Editor SDK supports playing only audio tracks stored on the device.

## Connect Mubert
First, request API key from [Mubert](https://mubert.com/).  
:exclamation:  Banuba is not responsible for providing Mubert API key.

Set Mubert API in [VideoEditorIntegrationModule](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorIntegrationModule.kt)
```kotlin
single {
    MubertApiConfig("API KEY")
}
```
and use ```false``` in [CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER](../android/app/src/main/java/com/vesdkreactnativeintegrationsample/VideoEditorIntegrationModule.kt#L53) to
play Mubert content in Video Editor Audio Browser.

## Complete full integration
This quickstart guide has just covered how to quickly integrate Android Video Editor SDK,
it is considered you managed to start video editor from your React Native CLI project.

We highly recommend to take advantage of all features and complete full integration of video editor
in your project by learning [Main Android quickstart guide](https://github.com/Banuba/ve-sdk-android-integration-sample/blob/main/mddocs/quickstart.md).

:bulb: Recommendations
- [Export guide](https://github.com/Banuba/ve-sdk-android-integration-sample/blob/main/mddocs/guide_export.md)
- [Advanced integration guide](https://github.com/Banuba/ve-sdk-android-integration-sample/blob/main/mddocs/advanced_integration.md)
- [Face AR and AR Cloud guide](https://github.com/Banuba/ve-sdk-android-integration-sample/blob/main/mddocs/guide_far_arcloud.md)
- [Audio guide](https://github.com/Banuba/ve-sdk-android-integration-sample/blob/main/mddocs/guide_audio_content.md)
- [Launch methods](https://github.com/Banuba/ve-sdk-android-integration-sample/blob/main/mddocs/advanced_integration.md#Launch-methods)
