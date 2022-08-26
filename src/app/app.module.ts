import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebcamComponent } from './webcam/webcam.component';
import { ReconocimientoComponent } from './reconocimiento/reconocimiento.component';

@NgModule({
  declarations: [
    AppComponent,
    WebcamComponent,
    ReconocimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
