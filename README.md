
Install node modules:

`npm install`

Install Cordova platforms and plugins (defined in the config.xml of this app):

`ionic cordova prepare`

Check installed platforms and plugins:

`ionic cordova platform ls`

`ionic cordova plugin ls`

You should see *android* and *ios* as installed platforms and *cordova-plugin-scanbot-sdk* as installed plugins. 


Connect a device via USB and run the app.

Android:

`ionic cordova run android`

iOS:

To run this example app on an iOS device you have to adjust some settings in Xcode: 
- *Provisioning* and *Code Signing* settings - see [Cordova docs](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html) 
- Make sure *ScanbotSDK.framework* was added as **Embedded Binary** - see our [Plugin docs](https://scanbotsdk.github.io/documentation/cordova/)

Then you can start the App in Xcode or via `ionic cordova run ios`.
