

## Local development instructions

1. npm install
2. cd ios
3. install cocoapods (see instruction: https://cocoapods.org/)
3. pod install

## Build instructions
1. Create an env.js with the following exported variables: 
  - API_URL
  - FACEBOOK_APP_ID
  - GOOGLE_ANDROID_APP_ID
  - GOOGLE_IOS_APP_ID
  - PRIVACY_URL
  - TERMS_URL
  - SENTRY_URL
  - BASE_URL
2. Create an branch.json file
## Build Android app
1. Generate your Fabric api key and add it in android/app/src/Manifest.xml
`<meta-data
            android:name="io.fabric.ApiKey"
            android:value="YOUR_FABRIC_API_KEY" />`
2. Add your google maps api key in android/app/src/Manifest.xml
`<meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAP_API_KEY" />`
3. Add Fabric apiSecret in android/app/fabric.properties
4. Add facebook credentials in android/app/src/main/res/values/strings
  `<string name="facebook_app_id">FB_AAP_ID</string>
   <string name="fb_login_protocol_scheme">FB_PROTOCOL</string>`
5. Create sentry.properties file with the following exported variables:
      `defaults.url=https://sentry.io/
      defaults.org=ORG
      defaults.project=PROGECT
      auth.token=YOUR_TOKEN
      cli.executable=node_modules/sentry-cli-binary/bin/sentry-cli`
6. Create google.json file for Google log in
7. Run react-native-cli start
## Build iOS app
1. Add your keys in mobile-app/ios/mobileapp/Info.plist
- Google maps api key
    `<dict>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLName</key>
			<string>YOUR_IOS_GOOGLE_MAP_KEY.apps.googleusercontent.com</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>YOUR_IOS_GOOGLE_MAP_KEY.apps.googleusercontent.com</string>
			</array>
		</dict>`
- Facebook credentials
  `<dict>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>YOUR_FB</string>
			</array>
		</dict>`
    `<key>FacebookAppID</key>
	  <string>YOUR_FacebookAppID</string>`
 - Fabric api key
    `<key>Fabric</key>
	  <dict>
		<key>APIKey</key>
		<string>YOUR_FABRIC_KEY</string>
		<key>Kits</key>
		<array>
			<dict>
				<key>KitInfo</key>
				<dict/>
				<key>KitName</key>
				<string>Crashlytics</string>
			</dict>
		</array>
	</dict>`
- Branch key
    `<key>branch_key</key>
    <string>YOUR_BRANCH_KEY</string>`
2. Create sentry.properties file with the following exported variables:
      `defaults.url=https://sentry.io/
      defaults.org=ORG
      defaults.project=PROGECT
      auth.token=YOUR_TOKEN
      cli.executable=node_modules/sentry-cli-binary/bin/sentry-cli`
3. Create GoogleService-Info.plist and add to iOS project
4. Run react-native-cli start


### References
 - [cocoapods](https://cocoapods.org/)
 - [crashlytics for android](https://fabric.io/kits/android/crashlytics/installl)
 - [crashlytics for ios](https://fabric.io/kits/ios/crashlytics/install)
 - [react-native](https://facebook.github.io/react-native/docs/getting-started.html)
 - [branch](https://docs.branch.io/pages/dashboard/integrate/)
 
## Known issues

* https://github.com/oblador/react-native-vector-icons/issues/626

To fix it use the command:
`rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json`



* java.lang.RuntimeException: Unable to load script from assets 'index.android.bundle'. Make sure your bundle is packaged correctly or you're running a packager server.



* https://github.com/wix/react-native-navigation/issues/410


keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore -list -v

## How to install Cocoapods

* You need Cocoapods  version 1.3.1. Check your version, please!
* Go to ios project 
* Enter pods install


