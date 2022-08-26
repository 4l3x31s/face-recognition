import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebcamComponent } from './webcam/webcam.component';
import { ReconocimientoComponent } from './reconocimiento/reconocimiento.component';

const routes: Routes = [
  {path: '', component: WebcamComponent},
  {path: 'rec', component: ReconocimientoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],


  exports: [RouterModule]
})
export class AppRoutingModule { }
