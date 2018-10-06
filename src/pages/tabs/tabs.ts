import { Component } from '@angular/core';

import { SdkUiPage } from '../sdk-ui/sdk-ui';
import { HomePage } from '../home/home';
import { FirstPage } from '../first/first';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = SdkUiPage;
  tab2Root: any = HomePage;
  tab3Root: any = FirstPage;

  constructor() {

  }
}
