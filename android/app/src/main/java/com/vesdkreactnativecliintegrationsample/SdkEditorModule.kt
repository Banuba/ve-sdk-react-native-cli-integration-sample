package com.vesdkreactnativecliintegrationsample

import android.app.Activity
import android.content.Intent
import android.content.res.AssetManager
import android.media.MediaScannerConnection
import android.net.Uri
import android.util.Log
import androidx.core.content.FileProvider
import androidx.core.net.toUri
import com.banuba.sdk.cameraui.data.PipConfig
import com.banuba.sdk.core.data.TrackData
import com.banuba.sdk.core.license.BanubaVideoEditor
import com.banuba.sdk.core.license.LicenseStateCallback
import com.banuba.sdk.export.data.ExportResult
import com.banuba.sdk.export.utils.EXTRA_EXPORTED_SUCCESS
import com.banuba.sdk.pe.PhotoCreationActivity
import com.banuba.sdk.ve.flow.VideoCreationActivity
import com.facebook.react.bridge.*
import com.google.android.exoplayer2.upstream.cache.CacheDataSink
import java.io.*
import java.util.*

class SdkEditorModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val TAG = "SdkEditorModule"

        // For Video Editor
        private const val OPEN_VIDEO_EDITOR_REQUEST_CODE = 1111

        // For Photo Editor
        private const val OPEN_PHOTO_EDITOR_REQUEST_CODE = 2222

        // Error codes
        private const val ERR_CODE_NOT_INITIALIZED = "ERR_SDK_NOT_INITIALIZED"
        private const val ERR_CODE_LICENSE_REVOKED = "ERR_SDK_EDITOR_LICENSE_REVOKED"
        private const val ERR_CODE_NO_HOST_CONTROLLER = "ERR_CODE_NO_HOST_CONTROLLER"
    }

    private var resultPromise: Promise? = null

    private var editorSDK: BanubaVideoEditor? = null
    private var integrationModule: VideoEditorIntegrationModule? = null

    private val videoEditorResultListener = object : ActivityEventListener {
        override fun onActivityResult(
            activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?
        ) {
            if (requestCode == OPEN_VIDEO_EDITOR_REQUEST_CODE) {
                when {
                    resultCode == Activity.RESULT_OK -> {
                        val exportResult = data?.getParcelableExtra<ExportResult.Success>(
                            EXTRA_EXPORTED_SUCCESS
                        )

                        val videoUri = exportResult?.videoList?.firstOrNull()?.sourceUri
                        val previewUri = exportResult?.preview

                        if (videoUri == null) {
                            resultPromise?.reject("ERR_MISSING_EXPORT_RESULT", "")
                        } else {
                            // Send video export results to React
                            val arguments: WritableMap = Arguments.createMap()
                            arguments.putString("videoUri", videoUri.toString())
                            arguments.putString("previewUri", previewUri?.toString())
                            Log.d(TAG, "Send video export results to React")
                            resultPromise?.resolve(arguments)

                            /*
                                NOT REQUIRED FOR INTEGRATION
                                Added for demonstrating exported video file
                            */
                            demoPlayExportedVideo(activity, videoUri)
                        }
                    }

                    resultCode == Activity.RESULT_CANCELED -> resultPromise?.reject("ERR_VIDEO_EXPORT_CANCEL", "")
                }
                resultPromise = null
            } else if (requestCode == OPEN_PHOTO_EDITOR_REQUEST_CODE) {
                when {
                    resultCode == Activity.RESULT_OK -> {
                        val photoUri = data?.getParcelableExtra(PhotoCreationActivity.EXTRA_EXPORTED) as? Uri

                        if (photoUri == null) {
                            resultPromise?.reject("ERR_MISSING_EXPORT_RESULT", "")
                        } else {
                            // Send photo export results to React
                            val arguments: WritableMap = Arguments.createMap()
                            arguments.putString("photoUri", photoUri.toString())
                            Log.d(TAG, "Send photo export results to React")
                            resultPromise?.resolve(arguments)
                        }
                    }

                    resultCode == Activity.RESULT_CANCELED -> resultPromise?.reject("ERR_PHOTO_EXPORT_CANCEL", "")
                }
                resultPromise = null
            }
        }

        override fun onNewIntent(intent: Intent?) {}
    }


    init {
        reactApplicationContext.addActivityEventListener(videoEditorResultListener)
    }

    override fun getName(): String = "SdkEditorModule"

    @ReactMethod
    fun initSDK(licenseToken: String, promise: Promise) {
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

    /**
     * Open Video Editor SDK
     */
    @ReactMethod
    fun openVideoEditor(promise: Promise) {
        checkLicense(callback = { isValid ->
            if (isValid) {
                // ✅ The license is active
                val hostActivity = currentActivity
                if (hostActivity == null) {
                    promise.reject(ERR_CODE_NO_HOST_CONTROLLER)
                } else {
                    this.resultPromise = promise
                    val intent = VideoCreationActivity.startFromCamera(
                        hostActivity,
                        PipConfig(video = Uri.EMPTY, openPipSettings = false),
                        null,
                        null
                    )
                    hostActivity.startActivityForResult(intent, OPEN_VIDEO_EDITOR_REQUEST_CODE)
                }
            } else {
                // ❌ Use of SDK is restricted: the license is revoked or expired
                promise.reject(ERR_CODE_LICENSE_REVOKED, "")
            }
        }, onError = { promise.reject(ERR_CODE_NOT_INITIALIZED, "") })
    }

    /**
     * Open Video Editor SDK
     */
    @ReactMethod
    fun openPhotoEditor(promise: Promise) {
        checkLicense(callback = { isValid ->
            if (isValid) {
                // ✅ The license is active
                val hostActivity = currentActivity
                if (hostActivity == null) {
                    promise.reject(ERR_CODE_NO_HOST_CONTROLLER, "")
                } else {
                    this.resultPromise = promise
                    hostActivity.startActivityForResult(
                        PhotoCreationActivity.startFromGallery(hostActivity.applicationContext), OPEN_PHOTO_EDITOR_REQUEST_CODE
                    )
                }
            } else {
                // ❌ Use of SDK is restricted: the license is revoked or expired
                promise.reject(ERR_CODE_LICENSE_REVOKED, "")
            }
        }, onError = { promise.reject(ERR_CODE_NOT_INITIALIZED, "") })
    }

    @ReactMethod
    fun openVideoEditorPIP(pipVideoPath: String, promise: Promise) {
        Log.d(TAG, "openVideoEditorPIP = $pipVideoPath")
        checkLicense(callback = { isValid ->
            if (isValid) {
                // ✅ The license is active
                val hostActivity = currentActivity
                if (hostActivity == null) {
                    promise.reject(ERR_CODE_NO_HOST_CONTROLLER, "")
                } else {
                    // sample_video.mp4 file is hardcoded for demonstrating how to open video editor sdk in the simplest case.
                    // Please provide valid video URL to open Video Editor in PIP.
                    this.resultPromise = promise

                    MediaScannerConnection.scanFile(
                        hostActivity,
                        arrayOf(File(pipVideoPath).absolutePath),
                        arrayOf()
                    ) { path, uri ->
                        Log.d(TAG, "Found path = $path, uri = $uri")

                        val intent = VideoCreationActivity.startFromCamera(
                            hostActivity,
                            PipConfig(video = uri, openPipSettings = false),
                            null,
                            null
                        )
                        hostActivity.startActivityForResult(intent, OPEN_VIDEO_EDITOR_REQUEST_CODE)
                    }
                }
            } else {
                // ❌ Use of SDK is restricted: the license is revoked or expired
                promise.reject(ERR_CODE_LICENSE_REVOKED, "")
            }
        }, onError = { promise.reject(ERR_CODE_NOT_INITIALIZED, "") })
    }

    @ReactMethod
    fun openVideoEditorTrimmer(promise: Promise) {
        checkLicense(callback = { isValid ->
            if (isValid) {
                // ✅ The license is active
                val hostActivity = currentActivity
                if (hostActivity == null) {
                    promise.reject(ERR_CODE_NO_HOST_CONTROLLER, "")
                } else {
                    // sample_video.mp4 file is hardcoded for demonstrating how to open video editor sdk in the simplest case.
                    // Please provide valid video URL to open Video Editor in trimmer.
                    val sampleVideoFileName = "sample_video.mp4"
                    val filesStorage: File = hostActivity.applicationContext.filesDir
                    val assets: AssetManager = hostActivity.applicationContext.assets
                    val sampleVideoFile = prepareMediaFile(assets, filesStorage, sampleVideoFileName)

                    this.resultPromise = promise
                    val intent = VideoCreationActivity.startFromTrimmer(
                        hostActivity,
                        arrayOf(sampleVideoFile.toUri()),
                        null,
                        null
                    )
                    hostActivity.startActivityForResult(intent, OPEN_VIDEO_EDITOR_REQUEST_CODE)
                }
            } else {
                // ❌ Use of SDK is restricted: the license is revoked or expired
                promise.reject(ERR_CODE_LICENSE_REVOKED, "")
            }
        }, onError = { promise.reject(ERR_CODE_NOT_INITIALIZED, "") })
    }

    /**
     * Applies selected audio on custom Audio Browser in Video Editor SDK.
     *
     * This implementation demonstrates how to play audio stored in Android assets in Video Editor SDK.
     *
     * Since audio browsing and downloading logic can be implemented using React Native on JS side
     * you can pass specific audio params in this method to build TrackData
     * and use it in "AudioBrowserActivity.applyAudioTrack".
     */
    @ReactMethod
    fun applyAudioTrack(promise: Promise) {
        val hostActivity = currentActivity

        // Check if host Activity is a your specific Android Activity responsible for
        // passing audio to Video Editor SDK i.e. AudioBrowserActivity.
        if (hostActivity is AudioBrowserActivity) {
            // Sample audio file used to demonstrate how to pass and play audio file
            // in Video Editor SDK
            val sampleAudioFileName = "sample_audio.mp3"
            val filesStorage: File = hostActivity.applicationContext.filesDir
            val assets: AssetManager = hostActivity.applicationContext.assets

            val audioTrack: TrackData? = try {
                // Video Editor SDK can play ONLY audio file stored on device.
                // Make sure that you store audio file on a device before trying to play it.
                val sampleAudioFile = prepareMediaFile(assets, filesStorage, sampleAudioFileName)

                // TrackData is required in Video Editor SDK for playing audio.
                TrackData(
                    UUID.randomUUID(), "Set title", Uri.fromFile(sampleAudioFile), "Set artist"
                )
            } catch (e: IOException) {
                Log.w(TAG, "Cannot prepare sample audio file", e)
                // You can pass null as TrackData to cancel playing last used audio in Video Editor SDK
                null
            }

            Log.d(TAG, "Apply audio track = $audioTrack")
            hostActivity.applyAudioTrack(audioTrack)
        }
    }

    @ReactMethod
    fun discardAudioTrack(promise: Promise) {
        val hostActivity = currentActivity
        if (hostActivity is AudioBrowserActivity) {
            hostActivity.discardAudioTrack()
            promise.resolve(null)
        } else {
            promise.reject(ERR_CODE_NO_HOST_CONTROLLER, "")
        }
    }

    @ReactMethod
    fun closeAudioBrowser(promise: Promise) {
        val hostActivity = currentActivity
        if (hostActivity is AudioBrowserActivity) {
            hostActivity.close()
            promise.resolve(null)
        } else {
            promise.reject(ERR_CODE_NO_HOST_CONTROLLER, "")
        }
    }

    private fun checkLicense(callback: LicenseStateCallback, onError: () -> Unit) {
        if (editorSDK == null) {
            Log.e(TAG, "Cannot check license state. Please initialize Video Editor SDK")
            onError()
        } else {
            // Checking the license might take around 1 sec in the worst case.
            // Please optimize use if this method in your application for the best user experience
            editorSDK?.getLicenseState(callback)
        }
    }

    /**
     * Utils methods used to prepare sample audio track for playing in Video Editor SDK.
     * NOT REQUIRED IN YOUR APP.
     */
    @Throws(IOException::class)
    private fun prepareMediaFile(
        assets: AssetManager, filesStorage: File, mediaFileName: String
    ): File {
        val sampleAudioFile = File(filesStorage, mediaFileName)

        var outputStream: OutputStream? = null
        try {
            assets.open(mediaFileName).use { inputStream ->
                outputStream = FileOutputStream(sampleAudioFile)
                val size = copyStream(inputStream, requireNotNull(outputStream))
                Log.d(TAG, "Media file has been copied. Size = $size")
            }
        } catch (e: IOException) {
            throw e
        } finally {
            outputStream?.flush()
            outputStream?.close()
        }

        return sampleAudioFile
    }

    @Throws(IOException::class)
    private fun copyStream(
        inStream: InputStream, outStream: OutputStream
    ): Long {
        var size = 0L
        val buffer = ByteArray(CacheDataSink.DEFAULT_BUFFER_SIZE)
        var bytes = inStream.read(buffer)
        while (bytes >= 0) {
            outStream.write(buffer, 0, bytes)
            size += bytes.toLong()
            bytes = inStream.read(buffer)
        }
        return size
    }

    /*
    NOT REQUIRED FOR INTEGRATION
    Added for playing exported video file.
    */
    private fun demoPlayExportedVideo(
        activity: Activity?, videoUri: Uri
    ) {
        activity ?: return

        val intent = Intent(Intent.ACTION_VIEW).apply {
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            val uri = FileProvider.getUriForFile(
                activity.applicationContext, "${activity.packageName}.provider", File(videoUri.encodedPath)
            )
            setDataAndType(uri, "video/mp4")
        }
        activity?.startActivity(intent)
    }
}
