import React
import BanubaVideoEditorSDK
import BanubaVideoEditorCore
import AVKit
import BanubaAudioBrowserSDK
import BanubaPhotoEditorSDK

typealias TimerOptionConfiguration = TimerConfiguration.TimerOptionConfiguration

@objc(SdkEditorModule)
class SdkEditorModule: NSObject, RCTBridgeModule {
  
  static let errEditorNotInitialized = "ERR_SDK_NOT_INITIALIZED"
  static let errEditorLicenseRevoked = "ERR_SDK_EDITOR_LICENSE_REVOKED"
    
  private var videoEditorSDK: BanubaVideoEditor?
  private var photoEditorSDK: BanubaPhotoEditor?
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  private var currentResolve: RCTPromiseResolveBlock?
  private var currentReject: RCTPromiseRejectBlock?
  
  private var customAudioTrackUUID: UUID?
  
  // Use “true” if you want users could restore the last video editing session.
  private let restoreLastVideoEditingSession: Bool = false
  
  @objc (initVideoEditorSDK:resolver:rejecter:)
  func initVideoEditorSDK(_ token: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
    guard videoEditorSDK == nil else { return }
    
    let config = createVideoEditorConfiguration()

    videoEditorSDK = BanubaVideoEditor(
      token: token,
      // set argument .useEditorV2 to true to enable Editor V2
      arguments: [.useEditorV2 : true],
      configuration: config,
      externalViewControllerFactory: CustomViewControllerFactory.shared
    )
    
    if videoEditorSDK == nil {
      reject(Self.errEditorNotInitialized, nil, nil)
      return
    }
    
    // Set delegate
    videoEditorSDK?.delegate = self
  }
  
  // Export callback
  @objc func openVideoEditor(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    prepareAudioBrowser()
    
    DispatchQueue.main.async {
      guard let presentedVC = RCTPresentedViewController() else {
        return
      }
      var musicTrackPreset: MediaTrack?
      
      // uncomment this if you want to set the music track
      
      //musicTrackPreset = self.setupMusicTrackPresent()
      
      let config = VideoEditorLaunchConfig(
        entryPoint: .camera,
        hostController: presentedVC,
        musicTrack: musicTrackPreset,
        animated: true
      )
      
      self.checkLicenseStateAndStart(with: config, rejecter: reject)
    }
  }
  
  @objc func openVideoEditorPIP(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    prepareAudioBrowser()
    DispatchQueue.main.async {
      guard let presentedVC = RCTPresentedViewController() else {
        return
      }
      
      // sample_pip_video.mp4 file is hardcoded for demonstrating how to open video editor sdk in the simplest case.
      // Please provide valid video URL to open Video Editor in PIP.
      let pipVideoURL = Bundle.main.url(forResource: "sample_video", withExtension: "mp4")
      
      let pipLaunchConfig = VideoEditorLaunchConfig(
        entryPoint: .pip,
        hostController: presentedVC,
        pipVideoItem: pipVideoURL,
        musicTrack: nil,
        animated: true
      )
      
      self.checkLicenseStateAndStart(with: pipLaunchConfig, rejecter: reject)
    }
  }
  
  @objc func openVideoEditorTrimmer(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    prepareAudioBrowser()
    
    DispatchQueue.main.async {
      guard let presentedVC = RCTPresentedViewController() else {
        return
      }
      
      // sample_video.mp4 file is hardcoded for demonstrating how to open video editor sdk in the simplest case.
      // Please provide valid video URL to open Video Editor in Trimmer.
      let trimmerVideoURL = Bundle.main.url(forResource: "sample_video", withExtension: "mp4")!
      let fileManager = FileManager.default
      let tmpURL = fileManager.temporaryDirectory.appendingPathComponent("sample_video.mp4")
      try? fileManager.removeItem(at: tmpURL)
      try? fileManager.copyItem(at: trimmerVideoURL, to: tmpURL)

      // Editor V2 is not available from Trimmer screen. Editor screen will be opened

      let trimmerLaunchConfig = VideoEditorLaunchConfig(
        entryPoint: .trimmer,
        hostController: presentedVC,
        videoItems: [tmpURL],
        musicTrack: nil,
        animated: true
      )
      
      self.checkLicenseStateAndStart(with: trimmerLaunchConfig, rejecter: reject)
    }
  }
  
  func checkLicenseStateAndStart(with config: VideoEditorLaunchConfig, rejecter reject: @escaping RCTPromiseRejectBlock) {
    if videoEditorSDK == nil {
      reject(Self.errEditorNotInitialized, nil, nil)
      return
    }
    
    // Checking the license might take around 1 sec in the worst case.
    // Please optimize use if this method in your application for the best user experience
    videoEditorSDK?.getLicenseState(completion: { [weak self] isValid in
      guard let self else { return }
      if isValid {
        print("✅ License is active, all good")
        DispatchQueue.main.async {
          self.videoEditorSDK?.presentVideoEditor(
            withLaunchConfiguration: config,
            completion: nil
          )
        }
      } else {
        // clear video editor session data and remove strong reference to video editor sdk instance
        if restoreLastVideoEditingSession == false {
          self.videoEditorSDK?.clearSessionData()
        }
        self.videoEditorSDK = nil
        print("❌ License is either revoked or expired")
        reject(Self.errEditorLicenseRevoked, nil, nil)
      }
    })
  }
  
  // MARK: - Photo Editor
  @objc (initPhotoEditorSDK:resolver:rejecter:)
  func initPhotoEditorSDK(_ token: String, _ resolve: @escaping RCTPromiseResolveBlock, _ reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard self.photoEditorSDK == nil else { return }
      
      let configuration = PhotoEditorConfig()
      self.photoEditorSDK = BanubaPhotoEditor(
          token: token,
          configuration: configuration
      )
      
      if self.photoEditorSDK == nil {
        reject(Self.errEditorNotInitialized, nil, nil)
        return
      }
      
      // Set delegate
      self.photoEditorSDK?.delegate = self
      resolve(NSNull())
    }
  }
  
  @objc func openPhotoEditor(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let presentedVC = RCTPresentedViewController() else {
        return
      }
      if self.photoEditorSDK == nil {
        reject(Self.errEditorNotInitialized, nil, nil)
        return
      }
      
      self.currentResolve = resolve
      self.currentReject = reject
      
      self.photoEditorSDK?.getLicenseState(completion: { [weak self] isValid in
        guard let self else { return }
        if isValid {
          print("✅ License is active, all good")
          let launchConfig = PhotoEditorLaunchConfig(
            hostController: presentedVC,
            entryPoint: .gallery
          )
          self.photoEditorSDK?.presentPhotoEditor(withLaunchConfiguration: launchConfig, completion: nil)
        } else {
          print("❌ License is either revoked or expired")
          self.photoEditorSDK = nil
          reject(Self.errEditorLicenseRevoked, nil, nil)
        }
      })
    }
  }
  
  // MARK: - Audio tracks
  
  // Applies audio track from custom audio browser
  @objc func applyAudioTrack(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    // Specify audio track URL. Video Editor SDK can apply tracks stored on the device.
    // In this sample we use audio file stored in the project.
    let audioURL = Bundle.main.url(forResource: "sample_audio", withExtension: "mp3")
    
    if (audioURL == nil) {
      let errMessage = "Failed to apply audio track. Unknow file"
      print(errMessage)
      self.currentReject!("", errMessage, nil)
      return
    }
    
    // Specify custom track name and additional data
    let trackName = "Track Name"
    let additionTitle = "Awesome artist"
    
    DispatchQueue.main.async {
      self.customAudioTrackUUID = UUID()
      let audioBrowserModule = self.getAudioBrowserModule()
      
      // Apply audio in Video Editor SDK
      audioBrowserModule.trackSelectionDelegate?.trackSelectionViewController(
        viewController: audioBrowserModule,
        didSelectFile: audioURL!,
        isEditable: true,
        title: trackName,
        additionalTitle: additionTitle,
        uuid: self.customAudioTrackUUID!
      )
      
      print("Audio track is applied")
      
      self.currentResolve!(nil)
    }
  }
  
  // Discards audio track in custom audio browser
  @objc func discardAudioTrack(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    DispatchQueue.main.async {
      let audioBrowserModule = self.getAudioBrowserModule()
      
      audioBrowserModule.trackSelectionDelegate?.trackSelectionViewControllerDiscardCurrentTrack(
        viewController: audioBrowserModule
      )
      
      
      print("Audio track is discarded")
      
      // Closes audio browser once track is discared. You can comment this line and avoid closing audio browser screen after discard.
      audioBrowserModule.trackSelectionDelegate?.trackSelectionViewControllerDidCancel(viewController: audioBrowserModule)
      
      self.currentResolve!(nil)
    }
  }
  
  // Closes audio browser
  @objc func closeAudioBrowser(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    self.currentResolve = resolve
    self.currentReject = reject
    
    DispatchQueue.main.async {
      let audioBrowserModule = self.getAudioBrowserModule()
      audioBrowserModule.trackSelectionDelegate?.trackSelectionViewControllerDidCancel(viewController: audioBrowserModule)
      
      self.currentResolve!(nil)
    }
  }
  
  // Prepares Audio Browser
  private func prepareAudioBrowser() {
    if (!AppDelegate.configEnableCustomAudioBrowser) {
      BanubaAudioBrowser.setMubertKeys(
        license: AppDelegate.mubertApiLicense,
        token: AppDelegate.mubertApiKey
      )
    }
  }
  
  private func getAudioBrowserModule() -> AudioBrowserModule {
    return (
      CustomViewControllerFactory.shared.musicEditorFactory as! CustomAudioBrowserViewControllerFactory
    ).audioBrowserModule!
  }
  
  /*
   NOT REQUIRED FOR INTEGRATION
   Added for playing exported video file.
   */
  func demoPlayExportedVideo(videoURL: URL) {
    
    guard let controller = RCTPresentedViewController() else {
      return
    }
    
    let player = AVPlayer(url: videoURL)
    let vc = AVPlayerViewController()
    vc.player = player
    
    controller.present(vc, animated: true) {
      vc.player?.play()
    }
  }
  
  private func createVideoEditorConfiguration() -> VideoEditorConfig {
    var config = VideoEditorConfig()
    // Do customization here
    
    // Show mute audio button on Camera screen
    config.featureConfiguration.isMuteCameraAudioEnabled = true
    
    // Sets 3, 10 seconds timer for recording on Camera
    config.recorderConfiguration.timerConfiguration.options = [
      TimerOptionConfiguration(
        button: ImageButtonConfiguration(
          imageConfiguration: ImageConfiguration(imageName: "camera.time_effects_on")
        ),
        startingTimerSeconds: 3,
        stoppingTimerSeconds: .zero,
        description: String(format: NSLocalizedString("hands.free.seconds", comment: ""), "3")
      ),
      TimerOptionConfiguration(
        button: ImageButtonConfiguration(
          imageConfiguration: ImageConfiguration(imageName: "camera.time_effects_on")
        ),
        startingTimerSeconds: 10,
        stoppingTimerSeconds: .zero,
        description: String(format: NSLocalizedString("hands.free.seconds", comment: ""), "10")
      )
    ]
    
    return config
  }
  // MARK: - Create music track
  private func setupMusicTrackPresent() -> MediaTrack {
    let documentsUrl = Bundle.main.bundleURL.appendingPathComponent("Music/long")
    let directoryContents = try? FileManager.default.contentsOfDirectory(at: documentsUrl, includingPropertiesForKeys: nil)
    let wavFile = directoryContents!.first(where: { $0.pathExtension == "wav" })!
    let urlAsset = AVURLAsset(url: wavFile)
    let urlAssetTimeRange = CMTimeRange(start: .zero, duration: urlAsset.duration)
    let mediaTrackTimeRange = MediaTrackTimeRange(
      startTime: .zero, playingTimeRange: urlAssetTimeRange
    )
    let musicTrackPreset = MediaTrack(
      uuid: UUID(),
      id: nil,
      url: wavFile,
      coverURL: nil,
      timeRange: mediaTrackTimeRange,
      isEditable: true,
      title: "test"
    )
    
    return musicTrackPreset
  }
  
  // MARK: - RCTBridgeModule
  static func moduleName() -> String! {
    return "SdkEditorModule"
  }
}

// MARK: - Export flow
extension SdkEditorModule {
  func exportVideo() {
    guard let videoEditorSDK else { return }
    let progressViewController = createProgressViewController()
    progressViewController.cancelHandler = { videoEditorSDK.stopExport() }
    guard let presentedVC = RCTPresentedViewController() else {
      return
    }
    presentedVC.present(progressViewController, animated: true)
    
    let manager = FileManager.default
    // File name
    let firstFileURL = manager.temporaryDirectory.appendingPathComponent("tmp1.mov")
    if manager.fileExists(atPath: firstFileURL.path) {
      try? manager.removeItem(at: firstFileURL)
    }
    
    // Video configuration
    let exportVideoConfigurations: [ExportVideoConfiguration] = [
      ExportVideoConfiguration(
        fileURL: firstFileURL,
        quality: .auto,
        useHEVCCodecIfPossible: true,
        watermarkConfiguration: nil
      )
    ]
    
    // Export Configuration
    let exportConfiguration = ExportConfiguration(
      videoConfigurations: exportVideoConfigurations,
      isCoverEnabled: true,
      gifSettings: nil
    )
    
    // Export func
    videoEditorSDK.export(
      using: exportConfiguration,
      exportProgress: { [weak progressViewController] progress in
        DispatchQueue.main.async {
          progressViewController?.updateProgressView(with: Float(progress))
        }
      }
    ) { [weak self] (error, previewImageInfo) in
      let success = error == nil
      // Export Callback
      DispatchQueue.main.async {
        if success {
          // Result urls. You could interact with your own implementation.
          progressViewController.dismiss(animated: true)
          let previewImageData = previewImageInfo?.coverImage?.pngData()
          let previewImageUrl = FileManager.default.temporaryDirectory.appendingPathComponent("\(UUID().uuidString).png")
          try? previewImageData?.write(to: previewImageUrl)
          
          self?.currentResolve?([
            "videoUri": firstFileURL.absoluteString,
            "previewUri": previewImageUrl.absoluteString
          ])
          // clear video editor session data and remove strong reference to video editor sdk instance
          if self?.restoreLastVideoEditingSession == false {
            self?.videoEditorSDK?.clearSessionData()
          }
          self?.videoEditorSDK = nil
          
          /*
           NOT REQUIRED FOR INTEGRATION
           Added for playing exported video file.
           */
          self?.demoPlayExportedVideo(videoURL: firstFileURL)
        } else {
          self?.currentReject?("ERR_MISSING_EXPORT_RESULT", error?.errorMessage, nil)
          // clear video editor session data and remove strong reference to video editor sdk instance
          if self?.restoreLastVideoEditingSession == false {
            self?.videoEditorSDK?.clearSessionData()
          }
          self?.videoEditorSDK = nil
          print("Error: \(String(describing: error))")
        }
      }
    }
  }
  
  func createProgressViewController() -> ProgressViewController {
    let progressViewController = ProgressViewController.makeViewController()
    progressViewController.message = "Exporting"
    return progressViewController
  }
}

// MARK: - BanubaVideoEditorSDKDelegate
extension SdkEditorModule: BanubaVideoEditorDelegate {
  func videoEditorDidCancel(_ videoEditor: BanubaVideoEditor) {
    videoEditor.dismissVideoEditor(animated: true) { [weak self] in
      // clear video editor session data and remove strong reference to video editor sdk instance
      if self?.restoreLastVideoEditingSession == false {
        self?.videoEditorSDK?.clearSessionData()
      }
      self?.videoEditorSDK = nil
      self?.currentResolve?(NSNull())
    }
  }
  
  func videoEditorDone(_ videoEditor: BanubaVideoEditor) {
    videoEditor.dismissVideoEditor(animated: true) { [weak self] in
      self?.exportVideo()
    }
  }
}

// MARK: - BanubaPhotoEditorDelegate
extension SdkEditorModule: BanubaPhotoEditorDelegate {
  func photoEditorDidCancel(_ photoEditor: BanubaPhotoEditorSDK.BanubaPhotoEditor) {
    photoEditor.dismissPhotoEditor(animated: true) { [weak self] in
      self?.photoEditorSDK = nil
      self?.currentResolve?(NSNull())
    }
  }
  
  func photoEditorDidFinishWithImage(_ photoEditor: BanubaPhotoEditorSDK.BanubaPhotoEditor, image: UIImage) {
    let manager = FileManager.default
    let photoUrl = manager.temporaryDirectory.appendingPathComponent("tmp.png")
    if manager.fileExists(atPath: photoUrl.path) {
      try? manager.removeItem(at: photoUrl)
    }

    photoEditor.dismissPhotoEditor(animated: true) { [weak self] in
      self?.photoEditorSDK = nil
      
      do {
        try image.pngData()?.write(to: photoUrl)
        self?.currentResolve?([
          "photoUri": photoUrl.absoluteString
        ])
      } catch {
        self?.currentReject?("", error.errorMessage, nil)
        print("Error during image writing to disk: \(error)")
      }
    }
  }
}
