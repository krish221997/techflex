import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController, ToastController, Platform, AlertController } from 'ionic-angular';
import * as Tessaract from 'tesseract.js';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';
import { NgProgress } from 'ngx-progressbar';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { NativeStorage } from '@ionic-native/native-storage';
import ScanbotSdk, { MrzScannerConfiguration, BarcodeScannerConfiguration } from 'cordova-plugin-scanbot-sdk'
import SdkInitializer, { IMAGE_QUALITY } from '../../services/sdk-initializer';
const SBSDK = ScanbotSdk.promisify();
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedImage:string;
  imageText:string;
  ncount:number;
  constructor(public toss:ToastController,
    private ns:NativeStorage,
    private tts:TextToSpeech,
    private platform: Platform,
    private alertCtrl: AlertController,
    private loading:LoadingController,
    public navCtrl: NavController,private actionsh:ActionSheetController,private camera:Camera,public progress:NgProgress) {
      this.ns.getItem('notecount').then(result=>{
        this.ncount = result.count;
      })
      .catch(_=>{
        this.ns.setItem('notecount',{
          count:0,
        })
      })
  }
  refresh(){
    this.selectedImage = "";
    this.imageText = "";
  }

  chooseImage(){
    let actionSheet = this.actionsh.create({
      buttons: [
        {
          text: 'Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Capture Picture',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present();
  }

  getPicture(source:PictureSourceType){
    this.camera.getPicture({
      quality:100,
      destinationType:this.camera.DestinationType.DATA_URL,
      allowEdit:true,
      correctOrientation:true,
      sourceType:source,
      saveToPhotoAlbum:false,
    }).then(imageData=>{
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;

    })
    .catch(reason=>{
      alert(reason);
    })
  }

  speak(){
    this.tts.speak(this.imageText)
    .then(response=>{

    })
    .catch(error=>{
      alert(error)
    })
  }

  recog(){

    Tessaract.recognize(this.selectedImage)
    .progress(message => {
      if (message.status === 'recognizing text')
      this.progress.set(message.progress);
    })
    .catch(err => console.error(err))
    .then(result => {
      this.imageText = result.text;
    })
    .finally(resultOrError => {
      this.progress.done();
    });
  }

  public async startMrzScanner() {
    if (!(await this.checkLicense())) { return; }

    let config: MrzScannerConfiguration = {
      // Customize colors, text resources, etc..
      finderTextHint: 'Please hold your phone over the 2- or 3-line MRZ code at the front of your passport.'
    };

    if (this.platform.is('ios')) {
      let widthPx = window.screen.width;
      config.finderWidth = widthPx * 0.9;
      config.finderHeight = widthPx * 0.18;
    }

    const result = await SBSDK.UI.startMrzScanner({uiConfigs: config});
    if (result.status == 'OK') {
      const fields = result.mrzResult.fields.map(f => `<div>${f.name}: ${f.value} (${f.confidence.toFixed(2)})</div>`);
      this.showAlert(fields.join(''), 'MRZ Result');
    }
  }

  public async startBarcodeScannerUi() {
    if (!(await this.checkLicense())) { return; }

    let config: BarcodeScannerConfiguration = {
      finderTextHint: 'Please align the barcode or QR code in the frame above to scan it.'
    };
    const result = await SBSDK.UI.startBarcodeScanner({uiConfigs: config});
    if (result.status == 'OK') {
      this.showAlert(result.barcodeResult.textValue, `Barcode: ${result.barcodeResult.barcodeFormat}`);
    }
  }
  private async checkLicense() {
    const result = await SBSDK.isLicenseValid();
    if (result.isLicenseValid == true) {
      // OK - trial session, valid trial license or valid production license.
      return true;
    }
    this.showAlert("Scanbot SDK (trial) license has expired!");
    return false;
  }
  private showAlert(message: string, title: string = "Alert") {
    const prompt = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text: 'OK',
        }
      ]
    });
    prompt.present();
  }
}
