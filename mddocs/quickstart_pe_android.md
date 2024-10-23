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
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/Banuba/banuba-ve-sdk")
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

Specify Photo Editor SDK dependencies in the app [gradle](../android/app/build.gradle#L165) file.
```groovy
    def banubaPESdkVersion = '1.2.8'
    implementation "com.banuba.sdk:pe-sdk:${banubaPESdkVersion}"

    def banubaSdkVersion = '1.38.0'
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