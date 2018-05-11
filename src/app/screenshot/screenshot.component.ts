import { Component, OnInit } from '@angular/core';
import { OcrTextService } from '../services/ocr-text.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { AppConfig } from '../app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-screenshot',
  templateUrl: './screenshot.component.html',
  styleUrls: ['./screenshot.component.css']
})
export class ScreenshotComponent implements OnInit {

  constructor(private router : Router, private http : Http,
      private ocrTextService: OcrTextService, private config: AppConfig) {
  this.apiKey = config.getConfig('googleApiKey');
  this.cxKey = config.getConfig('googleCxKey');
  }

  screenshotImage : string;
  apiKey: string;
  cxKey: string;

  ngOnInit() {
  }
  
}
