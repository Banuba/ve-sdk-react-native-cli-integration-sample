# Photo Editor Quickstart on Android

This guide walks you through integrating the Android Photo Editor SDK into your React Native project. Integration and customization are performed in the `android` directory using native Android development practices.

- [Installation](#Installation)
- [Launch](#Launch)

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

Add dependencies to your app's [gradle](../android/app/build.gradle#L155)
```groovy
    dependencies {
        def banubaPESdkVersion = '1.3.2'
        implementation "com.banuba.sdk:pe-sdk:${banubaPESdkVersion}"

        def banubaSdkVersion = '1.49.5'
        implementation "com.banuba.sdk:core-sdk:${banubaSdkVersion}"
        implementation "com.banuba.sdk:core-ui-sdk:${banubaSdkVersion}"
        implementation "com.banuba.sdk:ve-gallery-sdk:${banubaSdkVersion}"
        implementation "com.banuba.sdk:effect-player-adapter:${banubaSdkVersion}"
        }
```

Ensure these plugins are in your app's [gradle](../android/app/build.gradle#L1).
```groovy
   plugins {
        id "com.android.application"
        id "kotlin-android"
        id "kotlin-parcelize"
}
```

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
After SDK initialization, invoke [openPhotoEditor](../App.js#L39) from React Native to launch the photo editor on Android:

```javascript
await SdkEditorModule.openPhotoEditor();
```
On the Android side, implement the [ReactMethod](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L87) to start Photo Editor.

```kotlin
  @ReactMethod
fun openPhotoEditor(promise: Promise) {
    if (photoEditorSDK == null) {
       // THE SDK is not initialized or token is invalod
    } else {
        val hostActivity = currentActivity
        if (hostActivity == null) {
            // Activity is not connected
        } else {
            this.resultPromise = promise
            hostActivity.startActivityForResult(
                PhotoCreationActivity.startFromGallery(hostActivity.applicationContext), OPEN_PHOTO_EDITOR_REQUEST_CODE
            )
        }
    }
}
```

> [!IMPORTANT]
> 1. Returns ```null```l if the license token is invalid – verify your token
> 2. [Check license activation](../android/app/src/main/java/com/vesdkreactnativecliintegrationsample/SdkEditorModule.kt#L353) before starting the editor.


## Documentation
Explore the full capabilities of our [Photo Editor SDK](https://docs.banuba.com/ve-pe-sdk/docs/android/requirements-pe)