import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ContainerComponent } from './container/container.component';
import { TwitComponent } from './twit/twit.component';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    TwitComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
