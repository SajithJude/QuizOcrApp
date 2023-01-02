import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { CameraComponent } from './camera/camera.component';
import { ScreenshotComponent } from './screenshot/screenshot.component';
import { FacedetectionComponent } from './facedetection/facedetection.component';
import { EmotionComponent } from './emotion/emotion.component';
import { ProductComponent } from './product/product.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'camera' },
  { path: 'screenshot', component: ScreenshotComponent },
  { path: 'camera', component: CameraComponent },
  { path: 'facedetection', component: FacedetectionComponent },
  { path: 'emotion', component: EmotionComponent },
  { path: 'product', component: ProductComponent },
  { path: 'map', component: MapComponent },




  { path: 'question', component: QuestionComponent }, 
  { path: '**', pathMatch: 'full', redirectTo: 'camera' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
