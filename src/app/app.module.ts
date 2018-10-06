import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { SdkUiPage } from '../pages/sdk-ui/sdk-ui';
import { PageFilterPage } from '../pages/sdk-ui/filter';
import { AboutPage } from '../pages/about/about';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { FirstPage } from '../pages/first/first';
import { SecondPage } from '../pages/second/second';
import { FinalPage } from '../pages/final/final';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { NgProgressModule } from 'ngx-progressbar';
import SdkInitializer from '../services/sdk-initializer';
import { NativeStorage } from '@ionic-native/native-storage';


import { TextToSpeech } from '@ionic-native/text-to-speech';


@NgModule({
  declarations: [
    MyApp,
    SdkUiPage,
    PageFilterPage,
    AboutPage,
    TabsPage,
    HomePage,
    FirstPage,
    SecondPage,
    FinalPage
  ],
  imports: [
    BrowserModule,
    NgProgressModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SdkUiPage,
    PageFilterPage,
    AboutPage,
    TabsPage,
    HomePage,
    FirstPage,
    SecondPage,
    FinalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    TextToSpeech,
    NativeStorage,
    SdkInitializer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
