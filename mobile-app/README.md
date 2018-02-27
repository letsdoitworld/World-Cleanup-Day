#WARNING
BUILDING ON ANDROID UPDATES THE JS IN THE ALREADY DEPLOYED CLIENTS
FOR MORE DETAILS SEE [this](https://expo.canny.io/feature-requests/p/support-isremotejsenabled-on-android)

## Local development instructions

1. yarn
2. yarn start
3. open the app in the expo mobile app

## Build instructions
1. Create an env.js with the following exported variables: 
  - API_URL
  - FACEBOOK_APP_ID
  - GOOGLE_ANDROID_APP_ID
  - GOOGLE_IOS_APP_ID
2. Create a app.json file. During the writing of this file, app.json contained the following keys :
  - name
  - version
  - sdkVersion ( this is set to v18.0.0 for now )
  - orientation
  - icon
  - slug
  - loading :
    - icon
  - facebookScheme
  - ios :
   - bundleIdentifier
   - buildNumber
   - supportsTablet
   - config :
      - googleSignIn :
        - reservedClientId
      - googleMapsApiKey
  - android :
    - package
    - config :
    - googleSignIn :
      - apiKey
      - certificateHash
    - googleMaps :
      - apiKey

### References
 - [app.json configuration](https://docs.expo.io/versions/v18.0.0/guides/configuration.html)
 - [expo facebook configuration](https://docs.expo.io/versions/v18.0.0/sdk/facebook.html)
 - [expo google configuration](https://docs.expo.io/versions/v18.0.0/sdk/google.html)
 - [expo build instructions](https://docs.expo.io/versions/v18.0.0/guides/building-standalone-apps.html)
 
## Known issues

* https://github.com/oblador/react-native-vector-icons/issues/626

To fix it use the command:
`rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json`



* java.lang.RuntimeException: Unable to load script from assets 'index.android.bundle'. Make sure your bundle is packaged correctly or you're running a packager server.



* https://github.com/wix/react-native-navigation/issues/410


