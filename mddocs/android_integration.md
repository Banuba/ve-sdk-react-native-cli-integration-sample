# Android Integration Guide into React Native CLI project

An integration and customization of Banuba Video Editor UI SDK is implemented in **android** directory
of your React Native CLI project using native Android development process.

## Basic
The following steps help to complete basic integration into your React Native CLI project.

<ins>All changes are made in **android** directory.</ins>
1. __Add Banuba Video Editor UI SDK dependencies__ </br>
    Add Banuba repositories in main gradle file to get Video Editor UI SDK and AR Cloud dependencies.
    ```groovy
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/Banuba/banuba-ve-sdk")
            credentials {
                username = "Banuba"
                password = ""
            }
        }
        maven {
            name = "ARCloudPackages"
            url = uri("https://github.com/Banuba/banuba-ar")
            credentials {
                username = "Banuba"
                password = ""
            }
        }
    ```
    [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/build.gradle#L55)</br><br>
    
   Add Video Editor UI SDK dependencies in app gradle file. 
```groovy
    // Banuba Video Editor SDK dependencies
    def banubaSdkVersion = '1.24.2'
    implementation "com.banuba.sdk:ffmpeg:4.4"
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
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/build.gradle#L310)</br><br>

2. __Add SDK Initializer class__ </br>
   Add [BanubaVideoEditorUISDK.kt](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/BanubaVideoEditorUISDK.kt) file.</br>
   This class helps to initialize and customize Video Editor UI SDK.</br><br>

3. __Initialize the SDK in your application__ </br>
   Use ```new BanubaVideoEditorUISDK().initialize()``` in your ```Application.onCreate()``` method to initialize the SDK.</br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.java#L66)</br><br>

4. __Add Video Editor React Package__ </br>
   Add [VideoEditorModule](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorModule.kt) and
   create new ReactPackage for Video Editor and add it in ```List<ReactPackage> getPackages()``` method in your [Application](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/MainApplication.java#L31).<br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorReactPackage.kt)</br><br>

5. __Update AndroidManifest.xml__ </br>
   Add ```VideoCreationActivity``` in your AndroidManifest.xml file. The Activity is used to bring together a number of screens in a certain flow.</br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/AndroidManifest.xml#L47)</br><br>

6. __Add assets and resources__</br>
    1. [bnb-resources](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/assets/bnb-resources) to use hardcoded Banuba AR and Lut effects.
       Using Banuba AR ```assets/bnb-resources/effects``` requires [Face AR product](https://docs.banuba.com/face-ar-sdk-v1). Please contact Banuba Sales managers to get more AR effects.<br></br>

    2. [color](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/color),
       [drawable](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable),
       [drawable-hdpi](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable-hdpi),
       [drawable-ldpi](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable-ldpi),
       [drawable-mdpi](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable-mdpi),
       [drawable-xhdpi](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable-xhdpi),
       [drawable-xxhdpi](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable-xxhdpi),
       [drawable-xxxhdpi](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/drawable-xxxhdpi) are visual assets used in views and added in the sample for simplicity. You can use your specific assets.<br></br>

    3. [values](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/tree/master/android/app/src/main/res/values) to use colors and themes. Theme ```VideoCreationTheme``` and its styles use resources in **drawable** and **color** directories.<br></br>

7. __Start the SDK__ </br>
   Use ```startAndroidVideoEditor()``` method defined in ```App.js``` to start Video Editor from React Native on iOS.</br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/App.js/App.js#L29)</br><br>
   Technically it invokes ```VideoCreationActivity.startFromCamera(...)``` method to start Video Editor UI SDK from Camera screen.
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorModule.kt#L78)</br><br>
   
   Since Video Editor UI SDK on Android is launched within ```VideoCreationActivity``` exported video is returned from the Activity into ```onActivityResult``` callback
   in [VideoEditorModule](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/VideoEditorModule.kt#25).</br><br>

   [Promises](https://reactnative.dev/docs/native-modules-android#promises) is used to make a bridge between Android and JS.<br>
   Export returns ```videoUri``` path as a String value were exported video stored on JS side.  
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/App.js/App.js#L29)<br></br>

8. __Configure export__</br>
   You can set custom export video file name using ```ExportParams.Builder.fileName()``` method.<br>
   [See example](https://github.com/Banuba/ve-sdk-react-native-cli-integration-sample/blob/master/android/app/src/main/java/com/vesdkreactnativecliintegrationsample/BanubaVideoEditorUISDK.kt#L232).<br></br>

## What is next?

We have covered a basic process of integration Video Editor UI SDK into your React Native CLI project.</br>
More integration details and customization options you will find in [Banuba Video Editor UI SDK Android Integration Sample](https://github.com/Banuba/ve-sdk-android-integration-sample).