import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FinalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-final',
  templateUrl: 'final.html',
})
export class FinalPage {
// Imgur image upload endpoint
public IMGUR_ENDPOINT:string = "https://api.imgur.com/3/image";
// Imgur client ID
public IMGUR_CLIENT_ID:string = "1b169681c9acbaa";

// Azure Face API endpoint (West-Central US Server)
public AZURE_ENDPOINT:string = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0";
// Azure Face API key
public AZURE_API_KEY:string = "611a93560e384e028c95b76dbcbf1dff";

// Global image that is encoded as a Base64 string
public image:string;
// Global error message that is shown when something goes wrong
public error:string;
// Global loading bool that indicates whether a photo is being analyzed
public loading:boolean;

public page1:string;
public page2:string;

constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.page1=navParams.get('data1');
  this.page2=navParams.get('data2');
  this.analyzeFace(this.page1,this.page2);
}
public analyzeFace(link1:string, link2:string):void {
        // If photo was taken
              this.loading = true;
              this.analyzeViaAzure(link1,link2,
                                // If analysis worked
                                (response) => {
                                      this.loading = false;
                                      this.analyzeFaceDetails(response);
                                },
                                // If analysis didn't work
                                () => {
                                      this.loading = false;
                                      this.error = "Error: Azure couldn't analyze the photo.";
                                }

  )
}

public analyzeViaAzure(link1:string, link2:string, analysisCallback:Function = null, failureCallback:Function = null):void {

// This is a subfunction that converts an object into a serialized URL format.
// For instance, { 'foo': 'bar' } becomes 'foo=bar'
let serialize= (parameters:object) => Object.keys(parameters).map(key => key + '=' + parameters[key]).join('&');

// Tell the server that we are querying/looking for a specific set of face data,
// and want it in the appropriate format

// We use the above function, serialize, to serialize our face parameters.
// Our body contains just one key, 'url', that contains our image link.
// We must convert our body JSON into a string in order to POST it.
let body = JSON.stringify({ 
  "faceId1":link1,
  "faceId2":link2
  });

// Create a POST request with the serialized face parameters in our endpoint
// Our API key is stored in the 'Ocp-Apim-Subscription-Key' header
var xhr = new XMLHttpRequest();
xhr.open("POST", `${this.AZURE_ENDPOINT}/verify`, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Ocp-Apim-Subscription-Key", this.AZURE_API_KEY);

// Once the request is sent, we check to see if it's successful
xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
          // 200 is a successful status code, meaning it worked!
          if (xhr.status == 200) {
                // We can grab the link from our HTTP response and call it back
                if (analysisCallback != null) {
                      analysisCallback(JSON.parse(xhr.response));
                }
          } else if (xhr.status >= 400 && failureCallback != null) {
                // If we receive a bad request error, we'll send our failure callback.
                console.error(JSON.stringify(JSON.parse(xhr.response), null, 2));
                failureCallback();
          }
    }
}

xhr.send(body);
}

// Populate the analysis array from a Face API response object
public analyzeFaceDetails(response:object):void {

let match = response['isIdentical'];
let confidence = response['confidence'];
if(match)
{
  alert("Verified");
}
else{
  alert("Not Verified");
}
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinalPage');
  }

}
