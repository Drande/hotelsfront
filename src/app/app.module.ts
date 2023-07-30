import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimengModule } from './primeng/primeng.module';
import { EmailService } from './shared/services/email/interfaces/email.service';
import { EmailjsService } from './shared/services/email/emailjs.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PrimengModule,
  ],
  providers: [
    {
      provide: EmailService,
      useClass: EmailjsService,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
