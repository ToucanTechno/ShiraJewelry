import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BabylonEngineComponent } from './babylon-engine/babylon-engine.component';

@NgModule({
  declarations: [
    AppComponent,
    BabylonEngineComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
