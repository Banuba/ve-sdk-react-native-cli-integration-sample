# Android Photo Editor SDK quickstart

This guide demonstrates how to quickly integrate Android Photo Editor SDK into your React Native project.
The main part of an integration and customization is implemented in ```android``` directory
in your React Native project using native Android development process.

Once complete you will be able to launch photo editor in your React Native project.

- [Installation](#Installation)
- [Launch](#Launch)

## Installation
GitHub Packages is used for downloading SDK modules.
First, add repositories to [gradle](../android/build.gradle#L30) file in ```allprojects``` section.

```groovy
...

allprojects {
    repositories {
        ...

        maven {
            name = "nexus"
            url = uri("https://nexus.banuba.net/repository/maven-releases")
        }

        ...
    }
}
```

Specify Photo Editor SDK dependencies in the app [gradle](../android/app/build.gradle#L165) file.
```groovy
    def banubaPESdkVersion = '1.2.24'
    implementation "com.banuba.sdk:pe-sdk:${banubaPESdkVersion}"

    def banubaSdkVersion = '1.48.5'
    implementation "com.banuba.sdk:core-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:core-ui-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:ve-gallery-sdk:${banubaSdkVersion}"
    implementation "com.banuba.sdk:effect-player-adapter:${banubaSdkVersion}"
```

Additionally, make sure the following plugins are in your app [gradle](../android/app/build.gradle#L2) file.
```groovy
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-parcelize'
```

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

Next, add ```BanubaSdkReactPackage```  to the list of packages in [Application](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.kt#L23) class
```kotlin
    override fun getPackages(): MutableList<ReactPackage> {
    val packages = PackageList(this).packages
    packages.add(BanubaSdkReactPackage())
    return packages
}
```

[Promises](https://reactnative.dev/docs/native-modules-android#promises) feature is used to make a bridge between React Native and Android.

Invoke [initSDK](../App.js#L16) on React Native side to initialize SDK with the license token.
```javascript
SdkEditorModule.initSDK(LICENSE_TOKEN);
```

Add [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L140) on Android side to initialize Video Editor SDK.

> [!IMPORTANT]
> 1. Instance ```editorSDK``` is ```null``` if the license token is incorrect. In this case you cannot use photo editor. Check your license token.
> 2. It is highly recommended to [check license](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L183) if the license is active before starting Photo Editor.

Finally, once the SDK in initialized you can invoke [openPhotoEditor](../App.js#L39) message from React Native to Android

```javascript
await SdkEditorModule.openPhotoEditor();
```

and add [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L166) on Android side to start Photo Editor.