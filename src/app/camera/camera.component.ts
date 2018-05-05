import { Component, OnInit, EventEmitter } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor(private router : Router, private http : Http) { }

  maxCameraWidth : number;
  maxCameraHeight : number;
  cameraImage : WebcamImage;

  ngOnInit() {
    this.maxCameraHeight = window.innerHeight;
    this.maxCameraWidth = window.innerWidth;
  }

  public showCamera = true;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  takePicture() {
    this.trigger.next();
  }

  public handleImage(cameraImage: WebcamImage): void {
    var self = this;
    self.showCamera = false;
    self.cameraImage = cameraImage;
    var ocrText = "";
    self.http.post(
      "https://vision.googleapis.com/v1/images:annotate?" +
      "key=AIzaSyAnbHJbJR8zdaDhG9pigGjtU3SKLHjFHqU&",
      {
        "requests": [
          {
            "image": {
              "content": cameraImage.imageAsBase64
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      }
    )
    .subscribe(
      (res: any) => {
        ocrText = res.json().responses[0].fullTextAnnotation.text;
        self.router.navigate(['question', {ocrText: ocrText}]);
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
