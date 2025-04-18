
import Foundation
import BanubaVideoEditorSDK
import BanubaUtilities
import React

class AudioBrowserModule: UIViewController, TrackSelectionViewController, RCTBridgeModule {

  // MARK: - TrackSelectionViewController
  var trackSelectionDelegate: BanubaUtilities.TrackSelectionViewControllerDelegate?

  static func moduleName() -> String! {
    return "audio_browser"
  }

  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func viewDidLoad() {
    // Show custom audio browser screen implemented in JS

    let factory = (UIApplication.shared.delegate as! AppDelegate).reactNativeFactory

    self.view = factory?.rootViewFactory.view(withModuleName: AudioBrowserModule.moduleName())
  }
}
