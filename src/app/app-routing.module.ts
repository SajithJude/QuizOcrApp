import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { CameraComponent } from './camera/camera.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'question' },
  { path: 'camera', component: CameraComponent },
  { path: 'question', component: QuestionComponent }, 
  { path: '**', pathMatch: 'full', redirectTo: 'question' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
