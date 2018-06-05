/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCCManager.h"
@import GoogleMaps;
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <react-native-branch/RNBranch.h>

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>
@import Firebase;


@implementation AppDelegate


- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Fabric with:@[[Crashlytics class]]];
  NSURL *jsCodeLocation;
  [GMSServices provideAPIKey:@"AIzaSyAuiO0DurwBFj9CZU_OqUlJlWo3dVZG314"];
 // [GMSPlacesClient provideAPIKey:@"AIzaSyAuiO0DurwBFj9CZU_OqUlJlWo3dVZG314"];
  
  [FIRApp configure];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if (![RNBranch.branch application:application openURL:url options:options]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                          openURL:url
                                                sourceApplication:sourceApplication
                                                       annotation:annotation
            ]
    || [RNGoogleSignin application:application
                           openURL:url
                 sourceApplication:sourceApplication
                        annotation:annotation
        ];
    return YES;
  }
  return YES;
 
}
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
  return [RNBranch continueUserActivity:userActivity];
}

@end
