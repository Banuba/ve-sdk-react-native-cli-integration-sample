import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate {

  static var sharedBridge: RCTBridge?
  /*
   true - use custom audio browser implementation in this sample.
   false - use default default implementation.
   */
  static let configEnableCustomAudioBrowser = false
  
  // Set your Mubert Api key here
  static let mubertApiLicense = ""
  static let mubertApiKey = ""

  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {

    let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
    AppDelegate.sharedBridge = bridge

    self.moduleName = "vesdkreactnativecliintegrationsample"
    self.dependencyProvider = RCTAppDependencyProvider()
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
