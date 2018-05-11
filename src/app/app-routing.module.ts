import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { CameraComponent } from './camera/camera.component';
import { ScreenshotComponent } from './screenshot/screenshot.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'camera' },
  { path: 'screenshot', component: ScreenshotComponent },
  { path: 'camera', component: CameraComponent },
  { path: 'question', component: QuestionComponent }, 
  { path: '**', pathMatch: 'full', redirectTo: 'camera' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
