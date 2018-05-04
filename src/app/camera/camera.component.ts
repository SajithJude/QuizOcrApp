import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  constructor(private router : Router) { }

  maxCameraWidth : number;
  maxCameraHeight : number;

  ngOnInit() {
    this.maxCameraHeight = window.innerHeight;
    this.maxCameraWidth = window.innerWidth;
  }

  public showCamera = true;

  @Output() quizTextEmitter = new EventEmitter<string>();

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  takePicture() {
    this.trigger.next();
    this.showCamera = false;
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.quizTextEmitter.emit(webcamImage.imageAsBase64);
    this.router.navigate(['question']);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
