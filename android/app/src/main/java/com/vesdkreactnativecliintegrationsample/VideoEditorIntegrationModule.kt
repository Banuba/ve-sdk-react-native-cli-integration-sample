package com.vesdkreactnativecliintegrationsample

import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.app.Activity
import android.util.Log
import androidx.fragment.app.Fragment
import com.banuba.sdk.arcloud.data.source.ArEffectsRepositoryProvider
import com.banuba.sdk.arcloud.di.ArCloudKoinModule
import com.banuba.sdk.audiobrowser.di.AudioBrowserKoinModule
import com.banuba.sdk.audiobrowser.domain.AudioBrowserMusicProvider
import com.banuba.sdk.core.data.TrackData
import com.banuba.sdk.core.ui.ContentFeatureProvider
import com.banuba.sdk.effectplayer.adapter.BanubaEffectPlayerKoinModule
import com.banuba.sdk.cameraui.data.CameraConfig
import com.banuba.sdk.core.EditorUtilityManager
import com.banuba.sdk.core.domain.MediaNavigationProcessor
import com.banuba.sdk.ve.flow.VideoCreationActivity
import com.banuba.sdk.export.data.*
import com.banuba.sdk.export.di.VeExportKoinModule
import com.banuba.sdk.gallery.di.GalleryKoinModule
import com.banuba.sdk.playback.di.VePlaybackSdkKoinModule
import com.banuba.sdk.ve.di.VeSdkKoinModule
import com.banuba.sdk.ve.ext.VideoEditorUtils.getKoin
import com.banuba.sdk.ve.flow.di.VeFlowKoinModule
import com.banuba.sdk.veui.di.VeUiSdkKoinModule
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.core.error.InstanceCreationException
import org.koin.core.qualifier.named
import org.koin.dsl.module

class VideoEditorIntegrationModule {

    companion object {
        /**
         * true - enables custom audio browser implementation in this sample
         * false - default implementation
         */
        const val CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER = false
    }

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
                SampleModule().module,
            )
        }
    }
    fun release() {
        val utilityManager = try {
            // EditorUtilityManager is NULL when the token is expired or revoked.
            // This dependency is not explicitly created in DI.
            getKoin().getOrNull<EditorUtilityManager>()
        } catch (e: InstanceCreationException) {
            Log.w("CustomNavigation", "EditorUtilityManager was not initialized!", e)
            null
        }
        utilityManager?.release()
        stopKoin()
    }
}

private class SampleModule {

    val module = module {
        single<ArEffectsRepositoryProvider>(createdAtStart = true) {
            ArEffectsRepositoryProvider(
                arEffectsRepository = get(named("backendArEffectsRepository")),
                ioDispatcher = get(named("ioDispatcher"))
            )
        }

        // Audio Browser provider implementation.
        single<ContentFeatureProvider<TrackData, Fragment>>(
            named("musicTrackProvider")
        ) {
            if (VideoEditorIntegrationModule.CONFIG_ENABLE_CUSTOM_AUDIO_BROWSER) {
                AudioBrowserContentProvider()
            } else {
                // Default implementation that supports Mubert and Local audio stored on the device
                AudioBrowserMusicProvider()
            }
        }

        // Remove this config to enable multirecords
        single <CameraConfig>{
            CameraConfig(supportsMultiRecords = false)
        }

        // Opening PE from VE
        single<MediaNavigationProcessor> {
            object : MediaNavigationProcessor {
                override fun process(activity: Activity, mediaList: List<Uri>): Boolean {
                    val pngs = mediaList.filter { it.path?.contains(".png") ?: false }
                    return if (pngs.isEmpty()) {
                        true
                    } else {
                        Log.d("MediaNavigationProcessor", "Default image: ${pngs.first()}")
                        (activity as? VideoCreationActivity)?.closeWithResult(
                            ExportResult.Success(
                                emptyList(),
                                pngs.first(),
                                Uri.EMPTY,
                                Bundle()
                            )
                        )
                        false
                    }
                }
            }
        }
    }
}
