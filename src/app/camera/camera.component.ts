import { Component, OnInit, EventEmitter } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { OcrTextService } from '../services/ocr-text.service';
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor(private router : Router, private http : Http,
              private ocrTextService: OcrTextService, private config: AppConfig) {
    this.apiKey = config.getConfig('googleApiKey');
    this.cxKey = config.getConfig('googleCxKey');
   }

  maxCameraWidth : number;
  maxCameraHeight : number;
  cameraImage : WebcamImage;
  apiKey: string;
  cxKey: string;

  ngOnInit() {
    this.maxCameraHeight = window.innerHeight/2;
    this.maxCameraWidth = window.innerWidth;
  }

  public showCamera = true;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  takePicture() {
    this.trigger.next();
  }
  returnToCamera() {
    var self = this;
    self.showCamera = true;
    this.router.navigate(['camera']);
  }
  public handleImage(cameraImage: WebcamImage): void {
    var self = this;
    self.showCamera = false;
    self.cameraImage = cameraImage;
    var ocrText = "";
    // var ocrTet = "";

    self.http.post(
      "https://vision.googleapis.com/v1/images:annotate?" +
      "key=" + this.apiKey,
      {
        "requests": [
          {
            "image": {
              "content": cameraImage.imageAsBase64
            },
            "features": [
              {
                'type':'TEXT_DETECTION',
                'maxResults':5
              }
            ]
          }
        ]
      }
    )
    .subscribe(
      (res: any) => {
        // ocrText = res.json().responses[0].textAnnotations.description; 
        ocrText = res.json().responses[0].fullTextAnnotation.text;
        console.log(ocrText)
        self.ocrTextService.ocrText = ocrText;
        // self.router.navigate(['question']);
        self.router.navigate(['camera']);

      },
      (err: Error) => {
        self.handleError(err);
        self.router.navigate(['camera']);
      }
    )
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
  }

}
