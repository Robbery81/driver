import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRouting } from 'src/app/app.routing';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRouting, BrowserModule, RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
