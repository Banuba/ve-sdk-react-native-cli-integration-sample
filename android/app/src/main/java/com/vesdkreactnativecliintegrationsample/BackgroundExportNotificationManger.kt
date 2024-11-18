package com.vesdkreactnativecliintegrationsample

import com.banuba.sdk.export.data.ExportNotificationManager
import com.banuba.sdk.export.data.ExportResult
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import android.util.Log


class BackgroundExportNotificationManger() : ExportNotificationManager {

    companion object {
        const val TAG = "ExportNotificationManger"

        // Errors
        private const val ERR_FAILED_BACKGROUND_EXPORT = "ERR_FAILED_BACKGROUND_EXPORT"
    }

    private var isExportInProgress = false

    fun isExportInProgress(): Boolean {
        return isExportInProgress
    }

    private var resultPromise: Promise? = null

    fun setResultPromise(promise: Promise?) {
        resultPromise = promise
        if (!isExportInProgress){
            resultPromise?.reject("ERR_VIDEO_EXPORT_CANCEL", "")
        }
    }

    override fun showExportStartedNotification(){
        isExportInProgress = true
        Log.d(TAG, "Starting background export")
    }
    override fun showSuccessfulExportNotification(result: ExportResult.Success){
        isExportInProgress = false
        val videoUri = result.videoList.firstOrNull()?.sourceUri
        val previewUri = result.preview
        if (videoUri == null) {
            resultPromise?.reject("ERR_MISSING_EXPORT_RESULT", "")
        } else {
            val arguments: WritableMap = Arguments.createMap()
            arguments.putString("videoUri", videoUri.toString())
            arguments.putString("previewUri", previewUri.toString())
            resultPromise?.resolve(arguments)
        }
    }
    override fun showFailedExportExportNotification(){
        isExportInProgress = false
        Log.w(TAG, "Failed background export")
        resultPromise?.reject(ERR_FAILED_BACKGROUND_EXPORT, "")
    }
}