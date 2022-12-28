import { NgModule, APP_INITIALIZER } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';



import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { WebcamModule } from 'ngx-webcam';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CameraComponent } from './camera/camera.component';
import { QuestionComponent } from './question/question.component';
import { OcrTextService } from './services/ocr-text.service';
import { AppConfig } from './app.config';
import { ScreenshotComponent } from './screenshot/screenshot.component';

function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    CameraComponent,
    QuestionComponent,
    ScreenshotComponent
  ],
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule, 
    MatDividerModule,

    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    WebcamModule,
    HttpClientModule
  ],
  providers: [
  OcrTextService,
  AppConfig,
  {
    provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true
  }],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
