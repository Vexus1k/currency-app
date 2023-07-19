import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { CoreModule } from "./core/core.module";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UiModule } from "../assets/ui/ui.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    FormsModule,
    BrowserAnimationsModule,
    UiModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
