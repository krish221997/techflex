import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import ScanbotSdk, { ScanbotSDKConfiguration } from 'cordova-plugin-scanbot-sdk'

// TODO Put the Scanbot SDK license key here
const myLicenseKey =
"ln4AlBrSsVq5QNh9CbUyIObrSxKZmp" +
  "3DW51y0PJnWtvAGX8FmDVJDEYNek3a" +
  "joZxU5mTCmXoYNwELJ5Sy8SsdRA2+C" +
  "8O7Yi1oMgMfQajsPUe+W6sutqjld/g" +
  "Dmjpf5PHYmcDPIu3CS5A9nF2h5CAHH" +
  "N5q/lUJNtQGTyv6aPoep2EMk48GYvF" +
  "IfgD/rAC2cjNZqmGOslR3wr1UGxBED" +
  "+DRPIbdUPmklqcso3oM5sgKWXzUySd" +
  "MHBRxzCBJUDJtXTiJH87G3WWQjGwdc" +
  "HqNtSALQFZJnv7LaQ932XBZ0Rtd1Ew" +
  "HiqVEiSy5FsByGewkhwfBYHjNDXCiG" +
  "2CveF/0+jk4A==\nU2NhbmJvdFNESw" +
  "ppby5zY2FuYm90LmV4YW1wbGUuc2Rr" +
  "LmlvbmljMgoxNTQxNDYyMzk5CjU5MA" +
  "oz\n";

export const IMAGE_QUALITY = 80;

@Injectable()
export default class SdkInitializer {
  public _promise: Promise<any>;
  public _error: any;
  public _result: any;

  constructor(platform: Platform) {
    console.log("Starting SDK initializer...");
    this._promise = platform.ready().then(() => this.initScanbotSdk());
  }

  public onInitialize(callback: (err, result) => void) {
    if (this._promise) {
      this._promise = this._promise
        .then(result => {
          this._result = result;
          callback(null, result);
        }).catch(err => {
          this._error = err;
          callback(err, null);
        });
    } else {
      callback(this._error, this._result);
    }
  }

  private initScanbotSdk() {
    console.log("Initializing Scanbot SDK...");

    let config: ScanbotSDKConfiguration = {
      loggingEnabled: true, // ! Consider switching logging OFF in production builds for security and performance reasons !
      licenseKey: myLicenseKey,
      storageImageFormat: 'JPG',
      storageImageQuality: IMAGE_QUALITY
    };

    return ScanbotSdk.promisify().initializeSdk(config).then(result => {
      this._promise = null;
      console.log(JSON.stringify(result));
    });
  }
}
