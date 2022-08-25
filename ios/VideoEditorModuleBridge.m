//
//  VideoEditorModuleBridge.m
//  vesdkreactnativecliintegrationsample
//
//  Created by Andrei Karabach on 19.08.22.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VideoEditorModule, NSObject)

RCT_EXTERN_METHOD(openVideoEditor: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
